const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Pokemon', {
    id:{
      type:DataTypes.INTEGER,  
      defaultValue: DataTypes.UUIDV4, //me genera automaticamente un uuidv4   
      allowNull:true,
      primaryKey:true,

    },
    pokemonId:{
      type:DataTypes.INTEGER,  
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    hp:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 200 }
    },
    attack:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 200 }
    },
    defense:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 200 }
    },
    speed:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 200 }
    },
    height:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 200 }
    },
    weight:{
      type:DataTypes.INTEGER,
      validate: { min: 1, max: 3000 }
    },
    image:{
      type:DataTypes.STRING,
    },
    // img2:{
    //   type:DataTypes.STRING,
    // },
    itsCreated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    types: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    }   
  },{ timestamps: false });
};
