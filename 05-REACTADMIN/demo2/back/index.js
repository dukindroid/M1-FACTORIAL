// ./index.js
require("dotenv").config();
const express = require("express");
const app = new express();
const PORT = 3333;
const sequelize = require("./src/sequelize");
const { Op } = require("sequelize");
const { Pokemon, Type } = sequelize.models;
const allPokemons = require("./src/sequelize/jsonseed.json");
const axios = require("axios");
const crud = require("express-crud-router").default;
const sequelizeCrud =
  require("express-crud-router-sequelize-v6-connector").default;
Type.count
// Defimos nuestros headers HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Expose-Headers", "Content-Range"); // update to match the domain you will make the request from  ', '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Content-Range"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// Rutas CRUD
app.use(crud("/types", sequelizeCrud(Type)));
app.use(crud("/pokemons", sequelizeCrud(Pokemon)));
// Página de prueba
app.get("/", (req, res) => {
  res.send(`🖥 -- Funciona el back!`);
});
// Devuelve el id de un tipo según su nombre
app.get("/typeByName/:type", async (req, res) => {
  try {
    const thisType = await Type.findOne({
      where: {
        name: {
          [Op.substring]: req.params.type,
        },
      },
    });
    console.log(`Se encontró ${thisType}`);
    res.json(thisType.get("id"));
  } catch (error) {
    res.json(`Error! ${JSON.stringify(error)}`);
  }
});
// Ruta para desplegar funciones ayudadoras de sequelize
app.get("/mixins", (req, res) => {
  res.send(returnMixins(Type));
});
// Semilla: Inicializa la base de datos
app.get("/seed", async (req, res) => {
  try {
    res.json(await seedDB());
  } catch (error) {
    console.log("Hubo fallas: " + JSON.stringify(error));
    res.send(error);
  }
});
app.get("/seedtypes", async (req, res) => {
  try {
    await Type.sync({force:true})
    res.send(seedTypes() + "Tabla Types lista.");
  }
  catch (error) {
    res.status(500).send(error.msg)
  }
  
});
async function seedTypes () {
  const types = [
    {
      name: "normal",
      url: "https://pokeapi.co/api/v2/type/1/",
    },
    {
      name: "fighting",
      url: "https://pokeapi.co/api/v2/type/2/",
    },
    {
      name: "flying",
      url: "https://pokeapi.co/api/v2/type/3/",
    },
    {
      name: "poison",
      url: "https://pokeapi.co/api/v2/type/4/",
    },
    {
      name: "ground",
      url: "https://pokeapi.co/api/v2/type/5/",
    },
    {
      name: "rock",
      url: "https://pokeapi.co/api/v2/type/6/",
    },
    {
      name: "bug",
      url: "https://pokeapi.co/api/v2/type/7/",
    },
    {
      name: "ghost",
      url: "https://pokeapi.co/api/v2/type/8/",
    },
    {
      name: "steel",
      url: "https://pokeapi.co/api/v2/type/9/",
    },
    {
      name: "fire",
      url: "https://pokeapi.co/api/v2/type/10/",
    },
    {
      name: "water",
      url: "https://pokeapi.co/api/v2/type/11/",
    },
    {
      name: "grass",
      url: "https://pokeapi.co/api/v2/type/12/",
    },
    {
      name: "electric",
      url: "https://pokeapi.co/api/v2/type/13/",
    },
    {
      name: "psychic",
      url: "https://pokeapi.co/api/v2/type/14/",
    },
    {
      name: "ice",
      url: "https://pokeapi.co/api/v2/type/15/",
    },
    {
      name: "dragon",
      url: "https://pokeapi.co/api/v2/type/16/",
    },
    {
      name: "dark",
      url: "https://pokeapi.co/api/v2/type/17/",
    },
    {
      name: "fairy",
      url: "https://pokeapi.co/api/v2/type/18/",
    },
    {
      name: "unknown",
      url: "https://pokeapi.co/api/v2/type/10001/",
    },
    {
      name: "shadow",
      url: "https://pokeapi.co/api/v2/type/10002/",
    },
  ];
  try {
    await Promise.all(types.map(async (singleType, i) =>{
      console.log( i + ' ) ' + singleType.name)

      await Type.create({
        name: singleType.name
      })
    }))
      // let buf = ''   
      // types.map((type,i) => {
      //   buf.concat(Type.create(type.name))
      // })
      // console.log(buf)<<<<<<<<
    // let i = 0;
    // console.log(`Creando: ${JSON.stringify(types[0].)}`)
    // await Promise.all(
    //   types.forEach(async (type, i) => {
    //     i++;
    //     const newType = await Type.create({ name: type.name });
    //     console.log(`Creando tipo ${JSON.stringify(newType)}`);
    //   })
    //   );
    return "✔";
  } catch (error) {
    throw error.message;
  }
};
app.get("/jsonseed", async (req, res) => {
  try {
    // await sequelize.sync()
    // Pokemon.drop();
    // Indice de carga de 180 pokemones
    let nextRequest = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`;
    let allPokemons = [];
    let i = 0;
    let totalCount = 0;
    do {
      const apiRequest = await axios.get(nextRequest);
      // allPokemons.push(apiRequest.data.results)
      await Promise.all(
        apiRequest.data.results.map(async (el) => {
          let pokeData = await axios.get(el.url);
          // console.dir(onePokemon)
          const pokeObject = {
            pokeId: pokeData.data.id,
            name: pokeData.data.name,
            // img: pokeData.data.sprites.other.home.front_default,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeData.data.id}.png`,
            hp: pokeData.data.stats[0].base_stat,
            attack: pokeData.data.stats[1].base_stat,
            defense: pokeData.data.stats[2].base_stat,
            speed: pokeData.data.stats[5].base_stat,
            height: pokeData.data.height,
            weight: pokeData.data.weight,
            types: pokeData.data.types.map((el) => el.type.name).toString(),
          };
          totalCount++;
          console.log(
            `${totalCount}) ${pokeObject.name} - ${pokeObject.types}`
          );
          allPokemons.push(pokeObject);
          // const newPoke = await Pokemon.create(pokeObject)
          // await Promise.all(
          // 	pokeObject.types.split(',').forEach(
          // 		async (type) => {
          // 			debugger
          // 			const typeId = await Type.findOne({ where: { name: { [Op.substring]: type.name	}}})
          // 			console.log(`Agregando tipo - ${type.name} -> ${typeId}`)
          // 			newPoke.addType(typeId, { through: 'pokemons_types'})
          // 		}
          // 	)
          // )
        })
      );
      nextRequest = apiRequest.data.next;
      i++;
    } while (i < 7);
    res.json(allPokemons);
  } catch (error) {
    throw "💩 Error en seedPokemons " + JSON.stringify(error);
  }
});
// Puerto de escucha de nuestro server
app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}.`);
  chequearConnSequelize();
});
const seedDB = async () => {
  console.log(`users results in: ${buf}`)
  try {
    let buf = "";
    await sequelize.sync();
    buf += '######### Reinicializando Types: '
    buf += await seedTypes()
    buf += "######### Reinicializando Pokemons: ";
    buf += await seedPokemons();
    buf += "######### Reinicialición completa!";
    return buf;
  } catch (error) {
    throw "💩 Error en seedDB: " + error;
  }
};
function returnMixins(someModel) {
  const model = someModel;
  let buf = "";
  for (let assoc of Object.keys(model.associations)) {
    for (let accessor of Object.keys(model.associations[assoc].accessors)) {
      buf.concat(
        model.name + "." + model.associations[assoc].accessors[accessor] + "()"
      );
      // console.log(model.name + '.' + model.associations[assoc].accessors[accessor]+'()');
    }
  }
  return buf;
}


const seedPokemons = async () => {
  try {
    // const pokemons = await Pokemon.bulkCreate(allPokemons)
    const pokemons = await Pokemon.findAll();
    console.log(`Tenemos ${pokemons.length} pokemones`);
    await Promise.all(
      pokemons.map(async (onePoke) => {
        await Promise.all(
          onePoke.types.split(",").map(async (type) => {
            const thisType = await Type.findOne({
              where: { name: { [Op.substring]: type } },
            });

            console.log(
              onePoke.get("name") + " " + type + " " + thisType.get("id")
            );
            // console.log(`Agregando tipo - ${type.name} -> ${onePoke.name}`)
            await onePoke.addType(thisType, { through: "pokemons_types" });
          })
        );
      })
    );
  } catch (error) {
    throw "💩 Error en seedPokemons " + error;
  }
};
async function chequearConnSequelize() {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
  console.log(`A ver, si tengo conexión a ${DB_HOST}??? `);
  try {
    await sequelize.authenticate();
    console.log("Parece que si! 😎");
    // dbTest();
  } catch (error) {
    console.log("Parece que no... 😣 porque: ");
    console.log(error.message);
    process.exit(1);
  }
}
