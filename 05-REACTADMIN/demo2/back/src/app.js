require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./sequelize');
const { Pokemon, Type } = sequelize.models;
const {crud} = require('express-crud-router')
const connector = require("express-crud-router-sequelize-v6-connector");
// console.log(typeof )
console.dir(connector.default)
const sequelizeCrud = connector.default
async function dbTest() {
	console.log('Ahora busquemos un registro a ver si es cierto...')
	console.log(await Pokemon.findAll())
	console.log(await Type.findAll())
}

async function chequearConnSequelize() {
	console.log(`A ver si tengo conexión...`);
	try {
		await sequelize.authenticate();
		console.log('Parece que si! 😎');
		// dbTest();
	} catch (error) {
		console.log('Parece que no... 😣 porque: ');
		console.log(error.message);
		process.exit(1);
	}
}

const PORT = 3333;
const init = async () => {
	await chequearConnSequelize();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// Proveemos una ruta raiz para saber que Express está vivo:
	app.get('/', (req, res) => {
		res.send(`💩 -- Funciona el back!`);
	});
	
	app.use((req, res, next) => {
		// res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
		res.header('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count'); // update to match the domain you will make the request from  ', '*'); 
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content-Range');
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
		next();
	});

	app.use(crud("/admin/types", sequelizeCrud(Type)));
	// app.use(
	// 	crud('/admin/types', {
	// 		getList: ({ filter, limit, offset, order }) => Type.findAndCountAll({ limit, offset, order, where: filter }),
	// 		getOne: (id) => Type.findByPk(id),
	// 		create: (body) => Type.create(body),
	// 		update: (id, body) => Type.update(body, { where: { id } }),
	// 		destroy: (id) => Type.destroy({ where: { id } }),
	// 	})
	// )

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

module.exports = { init };
