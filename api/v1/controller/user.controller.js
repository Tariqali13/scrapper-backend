"use strict";

// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import model
const UserModel = require("../../../models/user.model");

// import service
const UserService = require("../../../services/user.service");

// import .env
const { ACCESS_TOKEN_SECRET, BUCKET_USER_BASE_URL } = process.env;

const multer = require("multer");
const _ = require("lodash");

// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");

// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");

// import node mailer
var nodemailer = require("nodemailer");

// create class object
const controller = {};

// Functions
const emailSendingFunc = async (req, res) => {
  const email = req.email;
  const code = req.code;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "renthub715@gmail.com",
      pass: "Pakistan1234#",
    },
  });

  var mailOptions = {
    from: "norply@gmail.com",
    to: email,
    subject: "Forget Password Code",
    html: `<p>Your Requested code is <br> <centrer> <h1 style="font-size: 60px">${code}</h1></center></p>`, // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

// APIs
controller.login = async (req, res) => {
  ConsoleLog("login Called");
  const email = req.body.email;
  const password = req.body.password;
  const userRes = await UserModel.findAll({
    where: {
      email: email,
      password: password,
    },
  });

  // Exception handling
  if (!(userRes.length > 0)) {
    let failure_400 = FailureResponse.failure_400;
    failure_400.message = "Email or password invalid";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Login successfully..!";
  success_200.data.items = userRes;
  res.send(success_200);
};

controller.register = async (req, res) => {
  let failure_400 = FailureResponse.failure_400;

  // exception handling
  if (_.isEmpty(req.body)) {
    console.log("Empty called");
    failure_400.message = "Object cannot be empty";
    failure_400.data.items = [];
    res.send(failure_400);
  } else {
    console.log("else called");
    const email = req.body.email;
    const emailRes = await UserModel.findAll({
      where: {
        email: email,
      },
    });

    if (emailRes.length > 0) {
      failure_400.message = "Email already exist!";
      failure_400.data.items = [];
      res.send(failure_400);
    }

    const user_name = req.body.user_name;
    const userNameRes = await UserModel.findAll({
      where: {
        user_name: user_name,
      },
    });

    if (userNameRes.length > 0) {
      failure_400.message = "User name already exist!";
      failure_400.data.items = [];
      res.send(failure_400);
    }
  }

  const userRes = await UserModel.create(req.body);

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Register successfully..!";
  success_200.data.items = userRes;
  res.send(success_200);
};

controller.forgetPassword = async (req, res) => {
  console.log("forgetPassword called...!");
  let failure_400 = FailureResponse.failure_400;

  const email = req.body.email;
  const userRes = await UserModel.findAll({
    where: {
      email: email,
    },
  });

  if (userRes.length > 0) {
    let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const updatedRes = await UserModel.update(
      {
        forget_code: code,
      },
      {
        where: {
          email: email,
        },
      }
    );
    const emailSendingObj = {
      email: email,
      code: code,
    };

    console.log("Code: " + code);
    if (updatedRes[0] === 1) {
      const emailRes = await emailSendingFunc(emailSendingObj);
      if (!emailRes) {
        failure_400.message = "Email does not sent";
        failure_400.data.items = [];
        res.send(failure_400);
      }
    }
  } else {
    failure_400.message = "Email does not exist";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message =
    "Code has been sent to your registeres email successfully!";
  success_200.data.items = [];
  success_200.data.isExist = true;
  res.send(success_200);
};

controller.codeVerification = async (req, res) => {
  console.log("update password called");
  let failure_400 = FailureResponse.failure_400;

  const email = req.body.email;
  const code = req.body.forget_code;

  const userRes = await UserModel.findAll({
    where: {
      email: email,
      forget_code: code,
    },
  });

  if (!(userRes.length > 0)) {
    failure_400.message = "Code does not match!";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Code matched!";
  success_200.data.items = [];
  success_200.data.isMatched = true;
  res.send(success_200);
};

controller.resetPassword = async (req, res) => {
  ConsoleLog("reset password called");
  let failure_400 = FailureResponse.failure_400;

  let isLoggedIn = req.body.isLoggedIn;
  isLoggedIn = isLoggedIn.toLowerCase();
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  if (isLoggedIn === "true") {
    const oldPassword = req.body.oldPassword;
    const userRes = await UserModel.findAll({
      where: {
        email: email,
        password: oldPassword,
      },
    });

    if (!(userRes.length > 0)) {
      failure_400.message = "Email or password invalid!";
      failure_400.data.items = [];
      res.send(failure_400);
    } else {
      const updatedRes = await UserModel.update(
        {
          password: newPassword,
          forget_code: null,
        },
        {
          where: {
            email: email,
          },
        }
      );

      if (updatedRes[0] === 0) {
        failure_400.message = "Your password does not update!";
        failure_400.data.items = [];
        res.send(failure_400);
      }

    }
  } else {
    const updatedRes = await UserModel.update(
      {
        password: newPassword,
        forget_code: null,
      },
      {
        where: {
          email: email,
        },
      }
    );
    if (updatedRes[0] === 0) {
      failure_400.message = "Your password does not update!";
      failure_400.data.items = [];
      res.send(failure_400);
    }
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Your password has been updated successfully!";
  success_200.data.items = [];
  success_200.isPasswordReset = true;
  res.send(success_200);

};

module.exports = controller;
