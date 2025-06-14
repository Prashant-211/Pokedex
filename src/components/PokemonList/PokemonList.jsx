import { use, useEffect, useState } from "react";
import axios from 'axios'
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {

    const [pokemonList,setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const Pokedex_URL = 'https://pokeapi.co/api/v2/pokemon';
    async function downloadPokemons() {
        const response = await axios.get(Pokedex_URL); // this downloads list of 20 pokempons
        const pokemonResult = response.data.results;  // we get the array of pokemons from result

        console.log(response.data);

        //iterating over the array of pokemons and using their url  to create an array of the promises
        //that will download those 20 pokemons
        const pokemonResultPromise = pokemonResult.map((pokemon)=> axios.get(pokemon.url));

        //passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise) // array of 20 pokemon detailed data

        console.log(pokemonData);

        //now iterate on the data of each pokemon and extract id ,name , image , types

        const PokeListResult = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data

            return { 
                        id : pokemon.id,
                        name : pokemon.name,
                        image : (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.other.dream_world.front_shiny,
                        types : pokemon.types
                    }
        });
        console.log(PokeListResult);
        setPokemonList(PokeListResult);
        setIsLoading(false);
    }
    useEffect(()=>{
        downloadPokemons();
    },[])
    return(
        <div className="pokemon-list-wrapper">
          <div className="pokemon-wrapper">
                {(isLoading)? 'Loading...' : pokemonList.map((p)=> <Pokemon name={p.name} image={p.image} key={p.id}/>)
                }
         </div>
         <div className="controls">
         <button>prev</button>
         <button>next</button>
         </div>

          
        </div>
    )
}

export default PokemonList;
