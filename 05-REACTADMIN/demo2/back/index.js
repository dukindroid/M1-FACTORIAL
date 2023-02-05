// ./index.js
// const app = require('./src/app');
require('dotenv').config();
const express = require('express')
const sequelize = require('./src/sequelize');
const crud = require('express-crud-router').default
const sequelizeCrud = require('express-crud-router-sequelize-v6-connector').default
const { 
	Pokemon, 
	Type 
} = sequelize.models;
const axios=require('axios')

const app = new express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Expose-Headers', 'Content-Range'); // update to match the domain you will make the request from  ', '*'); 
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content-Range');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use(crud('/type', sequelizeCrud(Type)))
app.use(crud('/pokemon', sequelizeCrud(Pokemon)))

app.get('/', (req, res) => {
	res.send(`💩 -- Funciona el back!`);
});

app.get('/seed', async (req, res) => {
	res.json(await seedDB())
})  

app.listen(3333, () => {
  console.log(`Express server started on port 3333.`);
  chequearConnSequelize()
});

async function seedDB() {
	try {  
		// Indice de carga de 180 pokemones
		let nextRequest = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`
		let allPokemons = []
		let i = 0  
		do {
			const apiRequest = await axios.get(nextRequest);
			// allPokemons.push(apiRequest.data.results)
			apiRequest.data.results.map(async (el) => {
				let pokeData = await axios.get(el.url);
				// console.dir(onePokemon)
				const pokeObject = {
					id: pokeData.data.id,
					name: pokeData.data.name,
					img: pokeData.data.sprites.other.home.front_default,
					img2: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeData.data.id}.png`,
					hp: pokeData.data.stats[0].base_stat,
					attack: pokeData.data.stats[1].base_stat,
					defense: pokeData.data.stats[2].base_stat,
					speed: pokeData.data.stats[5].base_stat,
					height: pokeData.data.height,
					weight: pokeData.data.weight,
					type:pokeData.data.types.map((el) => el.type.name.charAt(0).toUpperCase()+  el.type.name.slice(1)+' '),
				}
				console.log(pokeObject)
				Pokemon.create(pokeObject)
			})
			nextRequest = apiRequest.data.next;
			i++
		} while (i < 3)
		// return allPokemons
		/*
		console.log(el.url)
		allPokemons.map(async (onePokemon) => {
		})
		*/
	} catch (error) {
		return `Error!! ${error}`
	}
}

     /*
     //console.log(apiResults)
      const apiNext = await axios.get(apiResults.data.next);
      //console.log(apiNext)
      const allPokemons = apiResults.data.results.concat(apiNext.data.results);
     //console.log(allPokemons)
      for (let p of allPokemons) {
        delete p.url;
      }
      //console.log(allPokemons)
      return allPokemons;
		};*/

async function chequearConnSequelize() {
  const { DB_NAME,	DB_USER,	DB_PASSWORD,	DB_HOST } = process.env;
	console.log(`A ver si tengo conexión a ${DB_NAME},	${DB_USER},	${DB_PASSWORD},	${DB_HOST} `);
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