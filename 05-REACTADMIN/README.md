# React Admin

Una vez revisados los conceptos en la [presentación](http://yvy.dkndrd.com/Presentación1.pptx) veamos que podemos hacer con ellos. 

Supongamos que por alguna razón contamos yá con una API REST funcionando y que conocemos bien. Supongamos también que curiosamente esta API nos provee acceso a una base de datos en Postgres mediante Express a travéz de un modelo estructurado en Sequelize, el cual consta de dos tablas: Una con datos sobre videojuegos y otra con los posibles generos a los que pueden pertenecer estos videojuegos. Está de más decir que existe una relación de muchos a muchos entre estas dos tablas. Lo primero que tendremos que hacer será hacer accesible para React-Admin una interface CRUD desde nuestro back-end de Express.  

> - ¿¡Pero para qué!? ¡Si yo ya tengo rutas definidas en mi express para leer, crear, modificar y borrar! - *escucho ya decir a nuestra honorable audiencia...*

Claro, pero a pesar de que React Admin es un framework bastante abierto y flexible hay algunas reglas que seguir para poder mantener esa flexibilidad, siendo una de estas reglas el hecho de que como React-Admin es agnóstico al back-end que se le provea (es decir, no tiene porqué saber de donde viene la data del back-end, de que sabor es la base de datos que usamos, o en qué esta respaldada (si, se puede usar un archivo de texto plano como provider, por ejemplo)) lo único que nos pide es que nuestra API REST exponga un objeto con las siguientes propiedades:

```javascript
import express from 'express'
import crud from 'express-crud-router'
import { User } from './models'

const app = new express()
app.use(
  crud('/pi-videogames/videogames', {
    getList: ({ filter, limit, offset, order, opts: { req, res } }) =>
      Videogame.findAndCountAll({ limit, offset, order, where: filter }),
    getOne: (id, { req, res }) => Videogame.findByPk(id),
    create: (body, { req, res }) => Videogame.create(body),
    update: (id, body, { req, res }) => Videogame.update(body, { where: { id } }),
    destroy: (id, { req, res }) => Videogame.destroy({ where: { id } }),
  })
)
```

> - ¡Pero te digo que yo ya tengo rutas para todo eso en mi Express! ¿Para qué quieres que las repita? ¡Es ineficiente!!! - *bueno a ver, vamos a calmarnos...*

Como se dijo anteriormente, este requisito es una regla que se sigue sí o sí para cualquier back-end con la finalidad de establecer una interface común entre React Admin y el Data Provider de React Admin. De esta manera si nuestro back-end es más o menos popular, podemos contar con la seguridad de que habra un módulo adaptador ya escrito y probado. Incluso mejor, si de X back-end decidímos cambiar a Y otro, es tan fácil como cambiar el adaptador y listo. 

En el peor de los casos, si hasta aquí no se vé los quebraderos de cabeza que pudiera ahorrarnos este modelo *"ineficiente*" de tratamiento de nuestra API, podemos tomarlo de momento como una prueba de que seguimos buenas prácticas al momento de construirla ya que si realmente lo hicimos bien solo tenemos que importar algun que otro método de nuestro controlador del modelo en Express y listo. 

Un punto importante a tomar en cuenta aquí, es que al construir la API original establecimos mas que algún encabezado de `Access-Control-Allow-Origin` en el mejor de los casos, cuestión que con React Admin no es suficiente, ya que también por buenas prácticas, este objeto CRUD también se encargará de agregar los encabezados necesarios para que el acceso a nuestra data sea seguro y fiable.

Y si ninguna de las dos anteriores razones te convence que no es "repetir" nuestro CRUD, sino "exponerlo" como interface para darle mayor funcionalidad, entonces vas a tener que bancarme un poquito acá. Espero que al final de este pequeño tutorial todo tenga mayor sentido. 

En este ejemplo, la ruta `/videogame` nos proporciona la lista completa de la tabla videogames:

![Ruta videogame](/_src/assets/05-REACTADMIN/image1.png)

