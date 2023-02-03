const express = require('express');
const bodyParser = require('body-parser');
const { crud } = require("express-crud-router");
// const { sequelizeV6Crud } = require("express-crud-router-sequelize-v6-connector");
const app = express();
const sequelize = require('./sequelize');
const { Videogame, Genre } = sequelize.models;


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
