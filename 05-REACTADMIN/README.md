#
# React Admin

## Introducción

Una vez revisados los conceptos en la [presentación](http://yvy.dkndrd.com/Presentación1.pptx) veamos, que podemos hacer con ellos? Algo que me vino a la mente de primera mano, rapido, accesible y sencillo fue: "Porqué no refactorizar mi proyecto individual con esto a ver como queda?". De este proyecto podemos reutilizar nuestra base de datos y el ORM con sequelize por el lado de Back-end. Y dependiendo de qué tan bien hayamos modularizado nuestros componentes en el Front-end, estos también pueden reutilizarse. Parecemos ecologistas de tanto repetir "Reutilizar, Reutilizar y Reautilizar! ♻" pero básicamente es lo que está escrito en el párrafo inicial que describe qué es React.

## Demos

Como toda buena lecture, tendrá una estructura lo más similar a las lectures que estamos acostumbrados y funcionan tan bien (creo): Un par de demos explicados a pincel y una homework para que ud. se haga bolas y después destroce la compu tratando de pasar los test de Jest. El tema de los demos como ya se mencionó son dos PI's, en específico el mío, PI-Videogames, y el de un muy buen amigo, con un PI-Pokemons. Y esto tiene su razón:

### Demo 1: Videogames

![PI-Videogames](/_src/assets/05-REACTADMIN/image9.png)

Como autór intelectual de este crímen que fue mi PI, mi veredicto final ante el jurado fuel de declarar que quedó con un back que sinceramente para mis efectos era toda la funcionalidad que me había propuesto en la mínima cantidad de código posible, pero lamentablemente culpable de no haberle dedicado al front más que el mínimo de tiempo posible como para pintar algo en el canvas que medianamente no lastimara la vista. Un excelente back con un front... digamos... minimalista, por tratar de decirlo bonito. En primera instancia, traté de pegar todo esto del back de React-Admin directamente a una rama de mi PI, pero cuanto más avanzaba más comenzaba a derrumbarse debido a todas las malas prácticas que había ido dejando en el camino. Así que tuve que cambiar de enfoque - 

### Demo 2PI-Pokemons

![PI-Pokemons](/_src/assets/05-REACTADMIN/image10.png)

Sin ánimos de ofender a nadie, sino con la finalidad de la más sincera crítica constructiva, un proyecto que tenía a mano era este: Un muy bien logrado Front con un Back que ... pues... bueno este... 👉👈 le quita un poco de brillo al Front. 😅 Así que como anilo al dedo, podría empezar un back prácticamente de cero (solo con los modelos de sequelize y la db) y de ahí ir construyendo el back sin miedo al éxito. Funcionó perfecto, ahora solo queda ir armando el front y retomar lo aprendido para aplicarlo al demo 1.

### Homework

El mismo refactor anterior, pero con la tarea Desintegradora de Rick y Morty. No sé, piénsalo. 

![Aaaah maaai gaaad!](/_src/assets/05-REACTADMIN/image11.png)
#
## Back-end 

### Introducción

Supongamos que por alguna razón contamos yá con una API REST funcionando y que conocemos bien. Supongamos también que curiosamente esta API nos provee acceso a una base de datos en Postgres mediante Express a travéz de un modelo estructurado en Sequelize, el cual consta de dos tablas: Una con datos sobre pokemones y otra con los posibles tipos a los que pueden pertenecer estos pokemones. Está de más decir que existe una relación de muchos a muchos entre estas dos tablas. Lo primero que tendremos que hacer será hacer accesible para React-Admin una interface CRUD desde nuestro back-end de Express.  

> - ¿¡Pero para qué!? ¡Si yo ya tengo rutas definidas en mi express para leer, crear, modificar y borrar! - *escucho ya decir a nuestra honorable audiencia...*

### CRUD Express

Claro, pero a pesar de que React Admin es un framework bastante abierto y flexible hay algunas reglas que seguir para poder mantener esa flexibilidad, siendo una de estas reglas el hecho de que como React-Admin es agnóstico al back-end que se le provea (es decir, no tiene porqué saber de donde viene la data del back-end, de que sabor es la base de datos que usamos, o en qué esta respaldada (si, se puede usar un archivo de texto plano como provider, por ejemplo)) lo único que nos pide es que nuestra API REST exponga un objeto sí o si con los siguientes métodos:

- getList
- getOne
- create
- update
- destroy

Y siendo honestos, aún cuando tengas las mejores prácticas de todo el bootcamp, y seas la persona más prolijita del universo, dudo mucho que hayas escrito todas y cada una de las rutas necesarias para tener cuando menos un CRUD básico sin errores. Así que a por ello:

### Iniciando desde ceros

Vamos a estructurar nuestro proyecto de una manera muy similar al PI. Así que creémos una carpeta llamada `/back` e inicialicemos un package.json vacío ahí.

![Inicializando back package.json](/_src/assets/05-REACTADMIN/image2.png)

Ahora instalemos las herramientas que vamos a necesitar del lado del back, que serían:

a) express (obviamente)
b) mysql2 (nuestra base de datos en mysql, puedes instalar `pg` en su lugar, dado el caso)
c) sequelize (para que se conecte y nos la traduzca a objetos)
d) express-crud-router (aquí reside la magia ahora)
e) nodemon (viejo conocido)

![Instalando herramientas](/_src/assets/05-REACTADMIN/image3.png)

Lo cual debería dejarte con 126 paquetes instalados y 0 vulnerabilidades descubiertas. 

### La Base de Datos del Back-end

Ahora sí, hay que comenzar por el principio, donde sencillamente instanciamos nuestra app desde `./index.js` como de costumbre:

```javascript
// ./index.js
const PORT = 3333;
const app = require('./src/app');

app.listen(PORT, () => {
  console.log(`Servidor de Express escuchando en el puerto ${PORT}.`);
});
```
Ahora vayamos a `./src/app.js` donde cargaremos nuestros modelos y rutas pero con algunos truquitos de diferencia. Por cierto, casi olvidaba que también necesitamos la librería `body-parser` como middleware para express, y con ella traer y llevar datos de manera más directa desde nuetros bodies de los requests http. Así que también: `npm i body-parser` y ahora sí, creamos un archivo .env con estas credenciales: 

```bash
DB_NAME=u381026178_pokedex
DB_USER=u381026178_pokeuser
DB_PASSWORD=Pokepassword1
DB_HOST=sql811.main-hosting.eu
```
Recuerda que el archivo .env se crea con el propósito de evitar que GitHub se lleve nuestras privadas y preciadas contraseñas con el para distribuir con el mundo, así que ten cuidado con eso y la información acá contenida. Ahora sí, carguemos nuestras variables de entorno e instanciemos nuestro servidor de express:

```javascript 
// ./src/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./sequelize');
const { Pokemon, Genre } = sequelize.models;

```
En esta última línea de acá arriba, ojo cuidado con que nos estamos refiriendo a que queremos importar un archivo index.js dentro de la carpeta `./sequelize`, todavía no estamos cargando Sequelize en si. Asi que entonces vamos de una vez a crear dicha carpeta y archivo y porqué no, aprovechando que andamos con esto, creamos otra carpeta llamada models que incluya los modelos tal cual los creamos en su momento en el proyecto individual, lo cual dejaría nuestro arbol de archivos más o menos así:


![Instalando herramientas](/_src/assets/05-REACTADMIN/image4.png)

### Enlazando Modelos -> Sequelize -> DB

Ahora sí, vamos a instanciar sequelize en toda forma:

```javascript
// ./sequelize/index.js
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
```
Necesitamos este archivo `extra-setup.js`, basicamente para modularizar las relaciones entre nuestros modelos:

```javascript
// ./sequelize/extra-setup.js
function applyExtraSetup(sequelize) {
	const { Pokemon, Type } = sequelize.models;
  
  Pokemon.belongsToMany(Type, { through: "pokemons_types" });
  Type.belongsToMany(Pokemon, { through: "pokemons_types" });
}

module.exports = { applyExtraSetup };
```
De regreso a nuestra `app.js` y una vez con nuestro sequelize en pie, hagamos una pruebita para ver si sigue vivo agregando esto al final:

```javascript
// ./src/app.js (continuación)

async function dbTest() {
	console.log('Ahora busquemos un registro a ver si es cierto...')
	console.log(await Pokemon.findAndCountAll())
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
async function init() {
	await chequearConnSequelize();

	console.log(`Puedes crequear sequelize deasde el puerto ${PORT}...`);

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

init();
```
#### Listo, ya esta.
Y casi lo olvidaba, tendríamos que agregar esta otra línea también dentro de la sección `scripts` de nuestro archivo `package.json`:

```javascript
    "start": "@powershell nodemon -L index"
``` 
Acto seguido, ejecutamos en la terminal `npm start` y cruzamos los dedos 🤞

![Fale ferga la fida](/_src/assets/05-REACTADMIN/image5.png)

Algo no estuvo bien acá. Qué pudo haber pasado? En fin... después de revizar algo de lío que se hizo en CPanel a causa de sabrá dios qué, obtuvimos esto: 

![La vida vale mil chocomil](/_src/assets/05-REACTADMIN/image6.png)

Y por supuesto si lo checamos desde el navegador, no podía faltar esto:

![Caquitas bonitas de prueba](/_src/assets/05-REACTADMIN/image7.png)

Que obviamente tendremos que borrar después. Pero bueno, cuando menos ya sabemos que quien sabe hacia donde, pero hemos avanzado. La tabla Pokemons aparece de momento como `[]` _(vacia)_ debido a que la verdad no me quize quebrar la cabeza haciendo una precarga. De eso hablaremos luego. Por lo pronto sabemos que tenemos express conectado mediante sequelize a una base de datos. Ahora que sigue?

Claaaaaaro... las rutas, las rutas. Ninguna API REST lo es sin un montón de POST's y GET's, etc. por todas pártes en mil archivos no? Pero a ver, que te parece si cambiamos un poco nuestro archivo `app.js` de esta manera: Primero importando `{ crud }` desde `'express-crud-master'` y después agregando lo siguiente 👇

```javascript
// ./src/app.js
// (...)
const crud = require('express-crud-router')

// dentro de la función init:
// (...)
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
```
En este ejemplo, la ruta `/type` nos proporciona la lista completa de la tabla videogames:

![Back-end CRUD terminado](/_src/assets/05-REACTADMIN/image8.png)

No es hermoso? Acabamos de terminar la mitad del PI en... qué sería? Diez minutos? Poco menos poco más? Y lo mejor es que para el Front vamos a hacer más o menos lo mismo, en el mismo tiempo. 

> - ¡Pero te digo que yo ya tengo rutas para todo eso en mi Express! ¿Para qué quieres que las repita? ¡Es ineficiente!!! - *bueno a ver, vamos a calmarnos...*

Así como también estarán habilitadas las rutas para borrar, cambiar, etc. etc. Algo similar le pegamos ahí mismo sobre el modelo `Pokemons` y san se acabó. 

Como se dijo anteriormente, esta estructura en torno a la funcion `crud()` es una regla que se sigue sí o sí para cualquier back-end con la finalidad de establecer una interface común entre React Admin y el Data Provider de React Admin. De esta manera si nuestro back-end es más o menos popular, podemos contar con la seguridad de que habra un módulo adaptador ya escrito y probado. Incluso mejor, si de X back-end decidímos cambiar a Y otro, es tan fácil como cambiar el adaptador y listo. Los hay para GraphQL, para Prisma... para varias cosas...

En el peor de los casos, si hasta aquí no se vé los quebraderos de cabeza que pudiera ahorrarnos este modelo *"ineficiente*" de tratamiento de nuestra API, podemos tomarlo de momento como una prueba de que seguimos buenas prácticas al momento de construirla ya que si realmente lo hicimos bien solo tenemos que importar algun que otro método de nuestro controlador del modelo en Express y listo (Cosa que pensé que me iba a funcionar en PI-Videogames, pero _oh sorpresa!_ Las malas prácticas le ganaron a la reutilización de código). Aun y con el hecho de no haber podido reutilizar mucho código del back, fue mucho más rápido escribirlo desde 0.

Otro punto importante a tomar en cuenta aquí, es que al construir la API original establecimos mas que algún encabezado de `Access-Control-Allow-Origin` en el mejor de los casos, cuestión que con React Admin no es suficiente, ya que también por buenas prácticas, este objeto CRUD también se encargará de agregar los encabezados necesarios para que el acceso a nuestra data sea seguro y fiable.

Y si ninguna de las dos anteriores razones te convence que no es "repetir" nuestro CRUD, sino "exponerlo" como interface para darle mayor funcionalidad, entonces vas a tener que bancarme un poquito acá. Espero que al final de este pequeño tutorial todo tenga mayor sentido. 
#
## Front-end
#
### Introducción

Posiblemente nos tome horas, días, meses, AÑOS! incluso, terminar este front, así que vayamos despacio y estructurado. Lo que queremos aprender es a usar el React-Admin, así que caminemos por ese lado. Dejemos un rato en paz la carpeta de `./back` y vamos a hacer nuestro `npm init -y` en la carpeta `front`

### Configurando React-Admin

Una vez que hayamos instalado un buen `npx create-react-app front` (con la cantidad de errores y vulnerabilidades que sean, total, ni Dios es perfecto y no es como que nos tengamos que preocupar orita porque nos investigue la CIA o la NSA (todavía)), le damos `cd fromt ` y le agregámos tambien las librerías `react-admin` y `ra-data-simple-rest`:

![Instalando el front](/_src/assets/05-REACTADMIN/image12.png)

Y entonces quedó eso. Ya ustéd se la sabe, hay que borrar todo lo que no se ocupa y quedarnos nada mas con lo básico, sobretodo en `./src`. Una vez hecho esto, editamos `./src/App.js` para que nos quede algo así:

```javascript
// ./src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { TypeList } from './Types';

const App = () => (
    <Admin dataProvider={simpleRestProvider('localhost:3333')}>
        <Resource name="types" list={TypeList} />
    </Admin>
);
export default App;
```

Y de qué va esta `{TypeList}`? Es un ave? Es un avión? Es una prop? Es un componente? Pues fíjate que es un poco de todo esto. Vamos para allá:
#
```javascript
// ./src/Types/index.js 
import { Datagrid, List, TextField } from 'react-admin';
import React from 'react'

export const TypesList = {
  List: () => {
    return (
      <List >
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="name" />
        </Datagrid>
      </List>
    )
  }
}

const Types = () => <TypesList />

export default Types
```
#
# Corte informativo!!!


## Repo

El repo de esta lecture, junto con otras que me gustaría ir acabando de perfilar en la medida de lo imposible, lo encuentras [acá](https://github.com/dukindroid/M1-FACTORIAL). 