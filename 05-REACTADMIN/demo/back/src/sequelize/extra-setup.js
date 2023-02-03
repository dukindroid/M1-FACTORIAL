function applyExtraSetup(sequelize) {
	const { Videogame, Genre } = sequelize.models;

	Videogame.belongsToMany(Genre, { through: 'VideogameGenre', timestamps: false })
	Genre.belongsToMany(Videogame, { through: 'VideogameGenre', timestamps: false })
}

module.exports = { applyExtraSetup };
