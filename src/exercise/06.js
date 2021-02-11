// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

const initialState = {
  status: 'idle',
  pokemon: null,
  error: null,
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(initialState)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: 'pending', error: '', pokemon: null})

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', error: '', pokemon})
      },
      error => {
        setState({status: 'rejected', error, pokemon: null})
      },
    )
  }, [pokemonName])

  if (state.status === 'idle') {
    return 'Submit a pokemon'
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={state.pokemonName} />
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'rejected') {
    throw state.error
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPokemonName('')
          }}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
