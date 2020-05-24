import React from 'react';
import { withRouter } from "react-router-dom";

var $ = require('jquery');

class Pokemon extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            pokemon: {}
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        fetch(`/pokemon/${id}`).then(res => res.json())
            .then(pokemon => this.setState({ pokemon: pokemon[0] }));

    }
    handleChange(event){
        var value = event.target.value; 
            if(event.target.type === "checkbox"){                
                event.target.checked === true ? value = true :value = false; 
                event.target.value = value;
            }
                              
       console.log(value);
       console.log(event.target.value); 

        let currentPokemon = this.state.pokemon; 
        currentPokemon[event.target.name] = value; 

        this.setState({
            pokemon: currentPokemon
        });

    }
    handleSubmit(event){
        console.log(this.state.pokemon);
        $.ajax({
            url:`/pokemon/update`,
            method: 'POST',
            data: {
                id: this.state.pokemon.idNumber, 
                candyCount: this.state.pokemon.candyCount, 
                threeStars: this.state.pokemon.threeStars,
                needed: this.state.pokemon.needed
            },
            success: (data)=>{
               window.location.reload(false);
            }

        }); 
        event.preventDefault(); 
    }

    render() {
        const pokemonImgUrl = "https://db.pokemongohub.net/images/official/full/" + this.state.pokemon.idNumber + ".png"; 

        return (
            <div>
                <h1>Update Pokemon {this.state.pokemon.name}</h1>
                <img src={pokemonImgUrl} width="200px;" alt={this.state.pokemon.name}/>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="candyCount">Candy Holding Count: </label>
                        <input type="number" className="form-control" defaultValue={this.state.pokemon.candyCount || ''} name="candyCount" 
                        onInput={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <div className="form-check">
                        <input type="checkbox" htmlFor="threeStars" className="form-check-input" id="threeStars" name="threeStars" defaultChecked={this.state.pokemon.threeStars}
                        onClick={this.handleChange}
                        value="false"/>
                            <label htmlFor="threeStars" className="form-check-label">Three Stars </label>
                          
                        </div>
                    </div>
                    <div className="form-group">
                    <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="needed" name="needed" defaultChecked={this.state.pokemon.needed}
                    onClick={this.handleChange}
                    />
                        <label htmlFor="needed">Needed</label>
                       </div>
                    </div>

                <button type="submit" className="btn btn-primary">Update</button>

                </form>



            </div>
        )
    }



}
export default withRouter(Pokemon); 