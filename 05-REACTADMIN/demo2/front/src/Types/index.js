import { Datagrid, List, TextField } from 'react-admin';
import React from 'react'

export const TypesList = () => {
  return (
    <List >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
      </Datagrid>
    </List>
  )
}

const Types = () => <TypesList />

export default Types