// models/memo.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Memo = sequelize.define('Memo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Memo;
