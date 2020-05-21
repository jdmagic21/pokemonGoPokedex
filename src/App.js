import React from 'react';
import './App.css';
import PokemonTable from './components/PokemonTable'; 
import Pokemon from './components/Pokemon'; 

import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from 'react-router-dom'; 


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
      <Router>         
      
      <Switch>
        
        <Route path="/pokemon/edit/:id">
            <Pokemon /> 
          </Route>
          <Route path ="/">
           <PokemonTable data={this.state.pokemon} />
        </Route>
        </Switch>
        
      </Router>
    
    );
  }  
}

export default App;
