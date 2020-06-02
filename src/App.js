import React from 'react';
import './App.css';
import PokemonTable from './components/PokemonTable';
import Pokemon from './components/Pokemon';
import Login from './components/Login';
import FriendsAdd from './components/FriendsAdd'; 
import FriendsTable from './components/FriendsTable'; 

import
{
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';


class App extends React.Component
{
  constructor()
  {
    super();
    this.state = {
      pokemon: []
    }
  }

  render()
  {
    return (
      <main>
        <div className="Container">
          <Router>

            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/pokemon/edit/:id">
                <div className="row justify-content-center">
                  <Pokemon />
                </div>
              </Route>
              <Route path="/friends/add">
              <div className="row justify-content-center">
                  <FriendsAdd />
                </div>
              </Route>

              <Route path="/friends/edit/:name">
                <div className="row justify-content-center">
                  
                </div>
              </Route>

              <Route path="/friends">                
                  <FriendsTable />   
              </Route>

              

              <Route path="/">
                <PokemonTable />
              </Route>
            </Switch>

          </Router>
        </div>
      </main>
    );
  }
}

export default App;
