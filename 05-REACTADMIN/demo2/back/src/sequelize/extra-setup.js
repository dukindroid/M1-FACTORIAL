function applyExtraSetup(sequelize) {	
	const { Pokemon, Type } = sequelize.models;
  
	Pokemon.belongsToMany(Type, { through: "pokemons_types" });
	Type.belongsToMany(Pokemon, { through: "pokemons_types" });
}

module.exports = { applyExtraSetup };
