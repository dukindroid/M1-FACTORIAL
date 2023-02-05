import { Datagrid, ImageField, List, TextField } from 'react-admin';
import React from 'react'

export const PokemonsList = () => {
  return (
    <List >
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="hp" />
        <TextField source="atack" />
        <TextField source="defense" />
        <TextField source="speed" />
        <TextField source="height" />
        <TextField source="weight" />
        <ImageField source="img" />
        <ImageField source="img2" />
        <TextField source="itsCreated" />
      </Datagrid>
    </List>
  )
}

const Pokemons = () => <PokemonsList />

export default Pokemons