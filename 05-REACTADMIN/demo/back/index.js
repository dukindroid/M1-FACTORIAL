const app = require('./src/app');
const sequelize = require('./src/sequelize');
const PORT = 8080;
const { Videogame, Genre } = sequelize.models;

async function dbTest() {
	console.log('Ahora busquemos un registro a ver si es cierto...')
	console.log(await Videogame.findOne({ where: { id: 5286 } }))
}

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
		dbTest();
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();

	console.log(`Starting Sequelize + Express example on port ${PORT}...`);

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

init();