require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./sequelize');
const { Pokemon, Type } = sequelize.models;
const {crud} = require('express-crud-router')

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
		dbTest();
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

	app.use(
		crud('/type', {
			getList: ({ filter, limit, offset, order }) =>
				Type.findAndCountAll({ limit, offset, order, where: filter }),
			getOne: (id) => Type.findByPk(id),
			create: (body) => Type.create(body),
			update: (id, body) => Type.update(body, { where: { id } }),
			destroy: (id) => Type.destroy({ where: { id } }),
		})
	)

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

module.exports = { init };
