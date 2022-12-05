// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from "../pokemon";
import {ErrorBoundary} from "react-error-boundary";

const ErrorFallback = ({error, resetErrorBoundary}) => {
	return <div role="alert">
		There was an error: <pre style={{whiteSpace: "normal"}}>{error.message}</pre>
		<button onClick={resetErrorBoundary}>Try Again</button>
	</div>;
};

function pokemonReducer(state, action) {
	switch (action.type) {
		case "pending":
			return {
				pokemon: null, error: null, status: "pending"
			};
		case "rejected":
			return {
				...state, error: action.error, status: "rejected"
			};
		case "resolved":
			return {
				...state, pokemon: action.payload, status: "resolved"
			};
		default:
			return state;
	}
}

function getInitialPokemonState() {
	return {
		pokemon: null, error: null, status: "idle",
	};
}

function PokemonInfo({pokemonName}) {

	const [state, dispatch] = React.useReducer(pokemonReducer, null, getInitialPokemonState);

	React.useEffect(() => {

		if(!pokemonName) {
			return;
		}
		dispatch({type: "pending"});
		fetchPokemon(pokemonName)
			.then((data) => {
				dispatch({type: "resolved", payload: data});
			})
			.catch(err => {
				dispatch({type: "rejected", error: err});
			});
	}, [pokemonName]);

	const {error, pokemon, status} = state;
	if(status === "rejected") {
		throw error;
	}

	if(status === "idle") {
		return <span>Submit a pokemon</span>;
	}

	if(status === "pending") {
		return <PokemonInfoFallback name={pokemonName}/>;
	}
	return <PokemonDataView pokemon={pokemon}/>;
}

function App() {
	const [pokemonName, setPokemonName] = React.useState("");

	function handleSubmit(newPokemonName) {
		setPokemonName(newPokemonName);
	}

	return (
		<div className="pokemon-info-app">
			<PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
			<hr/>
			<ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]} onReset={() => {
				setPokemonName("");
			}}>
				<div className="pokemon-info">
					<PokemonInfo pokemonName={pokemonName}/>
				</div>
			</ErrorBoundary>
		</div>);
}

export default App;
