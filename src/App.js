import React from 'react';
import './App.css';
import PokemonTable from './components/PokemonTable'; 


class App extends React.Component{
  constructor(){
    super(); 
    this.state = {
      pokemon: []
    }
  }
  componentDidMount() {
      fetch("http://localhost:3000/pokemon", {method: 'GET'}).then(res => res.json())
        .then(pokemon => {
            this.setState({
                pokemon: pokemon
            }); 
        });
  }
  
  render(){
    return (
      <PokemonTable data={this.state.pokemon} />
    );
  }
  
}

export default App;
