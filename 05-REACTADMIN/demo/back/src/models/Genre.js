const  { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },{
    timestamps: false
  });
};
