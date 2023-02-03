const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./sequelize');
const { crud } = require("express-crud-router");
const { Videogame, Genre } = sequelize.models;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Expose-Headers', 'Content-Range'); // update to match the domain you will make the request from  ', '*'); 
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// app.use(crud("/videogame", sequelizeV6Crud(Videogame)));
// app.use(crud("/genre", sequelizeV6Crud(Genre)));
app.use(
  crud('/admin/videogames', {
    getList: ({ filter, limit, offset, order }) =>
      Videogame.findAndCountAll({ limit, offset, order, where: filter }),
    getOne: id => Videogame.findByPk(id),
    create: body => Videogame.create(body),
    update: (id, body) => Videogame.update(body, { where: { id } }),
    destroy: id => Videogame.destroy({ where: { id } }),
  })
)

app.use(
  crud('/admin/genres', {
    getList: ({ filter, limit, offset, order }) =>
      Genre.findAndCountAll({ limit, offset, order, where: filter }),
    getOne: id => Genre.findByPk(id),
    create: body => Genre.create(body),
    update: (id, body) => Genre.update(body, { where: { id } }),
    destroy: id => Genre.destroy({ where: { id } }),
  })
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We provide a root route just as an example
app.get('/', (req, res) => {
	res.send(`💩 -- Funciona el back!`);
});

module.exports = app;
