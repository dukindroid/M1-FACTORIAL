// ./src/App.js
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { TypesList } from './Types';
import { PokemonsList } from './Pokemons';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    // add your own headers here
    // console.dir(JSON.stringify((options.headers)))
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3333', httpClient, 'X-Total-Count');

// const dataProvider = simpleRestProvider();

function App() {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="types" list={TypesList} />
            <Resource name="pokemons" list={PokemonsList} />
        </Admin>
    )
};
export default App;