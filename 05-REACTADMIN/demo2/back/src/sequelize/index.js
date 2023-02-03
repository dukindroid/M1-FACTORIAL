const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
})

const modelDefiners = [
	require('../models/Pokemon'),
	require('../models/Type'),
];

// Definimos los modelos a partir de su nombre de archivo
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// Ejecutamos algo de configuración extra una vez definidos los modelos, como por ejemplo, establecer las relaciones:
applyExtraSetup(sequelize);

// Exportamos la instancia de conexión a sequelize que será usada en el resto de nuestra aplicación:
module.exports = sequelize;
