const Db = require('../server/boot/db.connection');
const {
    DataTypes
} = require("sequelize");

// import models for the relations
// ...

// db schema
const User = Db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    forget_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    freezeTableName: true,
    paranoid: true,
});

// Relations
// User.hasMany(model_name, {
//     foreignKey: 'user_id'
// });

module.exports = User;