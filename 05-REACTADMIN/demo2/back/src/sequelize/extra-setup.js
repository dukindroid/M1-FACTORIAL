console.log('Se requirió el archivo extra de configuración de sequelize...')

function applyExtraSetup(sequelize) {	
	console.log('Estableciendo relaciones...')
	const { Pokemon, Type } = sequelize.models;
	Pokemon.belongsToMany(Type, { through: "pokemons_types" });
	Type.belongsToMany(Pokemon, { through: "pokemons_types" });
}

module.exports = { applyExtraSetup };
