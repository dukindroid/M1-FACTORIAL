const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("Type", {
    // id:{
    //   type:DataTypes.INTEGER,
    //   autoIncrement: true,
    // },
    name: {
      type: DataTypes.STRING,
      primaryKey:true,
      unique:true,
      // allowNull: false,
    },
    
  },{
    timestamps: false 
  });
};