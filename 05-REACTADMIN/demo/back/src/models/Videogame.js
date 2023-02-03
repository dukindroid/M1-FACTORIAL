const  { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('Videogame', {
    id: {
      type: DataTypes.INTEGER,
      // defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true
    },
    isLocal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    name: {
      type: DataTypes.STRING,
      allownull: false
    },
    description: {
      type: DataTypes.TEXT,
      allownull: false
    },
    released: {
      type: DataTypes.DATE
    },
    rating: {
      type: DataTypes.FLOAT
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    img: {
      type: DataTypes.STRING
    }
  },{
    timestamps: false
  });
};
