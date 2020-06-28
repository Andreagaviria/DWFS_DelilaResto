const sequelize = require("sequelize");
const database = new sequelize("mysql://agp:andrea46.@localhost:3306/delila");

module.exports = database;
