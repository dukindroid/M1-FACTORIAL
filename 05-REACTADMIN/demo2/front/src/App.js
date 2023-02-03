// ./src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';
import { TypesList } from './Types';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3333/admin', httpClient);

// const dataProvider = simpleRestProvider('http://localhost:3333', fetchUtils.fetchJson, 'X-Total-Count');

const App = () => (
    <Admin dataProvider={simpleRestProvider(dataProvider)}>
        <Resource name="types" list={TypesList} />
    </Admin>
);
export default App;