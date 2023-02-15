import { Datagrid, ImageField, List, NumberField, ReferenceField, TextField } from 'react-admin';
import React from 'react'

export const PokemonsList = () => {
  return (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="pokemonId" reference="pokemons" />
            <TextField source="name" />
            <NumberField source="hp" />
            <NumberField source="attack" />
            <NumberField source="defense" />
            <NumberField source="speed" />
            <NumberField source="height" />
            <NumberField source="weight" />
            <ImageField source="img" />
            <NumberField source="itsCreated" />
            <TextField source="types" />
        </Datagrid>
    </List>
  )
}
    // <List >
    //   <Datagrid>
    //     <TextField source="pokeId" />
    //     <TextField source="name" />
    //     <TextField source="hp" />
    //     <TextField source="atack" />
    //     <TextField source="defense" />
    //     <TextField source="speed" />
    //     <TextField source="height" />
    //     <TextField source="weight" />
    //     <ImageField source="img" />
    //     <TextField source="itsCreated" />
    //     <TextField source="types" />
    //   </Datagrid>
    // </List>

const Pokemons = () => <PokemonsList />

export default Pokemons