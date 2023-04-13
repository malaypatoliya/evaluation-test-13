"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class demo extends Model {
    static associate(models) {
      // define association here
    }
  }
  demo.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      age: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "demo",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return demo;
};
