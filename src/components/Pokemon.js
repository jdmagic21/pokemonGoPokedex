import React from 'react';
import { withRouter } from "react-router-dom";
import './Pokemon.css';

var $ = require('jquery');

class Pokemon extends React.Component
{
    constructor()
    {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            pokemon: {}
        }
    }
    async componentDidMount()
    {
            const id = this.props.match.params.id;
            var pokemon = await fetch(`/pokemon/${id}`).then(res => res.json());
            var types = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res=>res.json());
            pokemon.types = types.types; 
            var images = await fetch (`/pokemon/image/${id}`).then(res=>res.json());
            pokemon.images = images; 

            this.setState({
                pokemon: pokemon
            }); 
      
    }
    handleChange(event)
    {
        var value = event.target.value;
        if (event.target.type === "checkbox")
        {
            event.target.checked === true ? value = true : value = false;
            event.target.value = value;
        }

        let currentPokemon = this.state.pokemon;
        currentPokemon[event.target.name] = value;

        this.setState({
            pokemon: currentPokemon
        });

    }
    handleSubmit(event)
    {
        $.ajax({
            url: `/pokemon/update`,
            method: 'POST',
            data: {
                id: this.state.pokemon.idNumber,
                candyCount: this.state.pokemon.candyCount,
                threeStars: this.state.pokemon.threeStars,
                needed: this.state.pokemon.needed
            },
            success: (data) =>
            {
                window.location.reload(false);
            }

        });
        event.preventDefault();
    }

    render()
    {
        var pokemonImgUrl = ""; 
        var type = ""; 
        
        if(Object.keys(this.state.pokemon).length !== 0){            
           pokemonImgUrl = `data:${this.state.pokemon.images.fullType.mime || ""};base64,${this.state.pokemon.images.fullBase64 || ""}`;
            type= this.state.pokemon.types[this.state.pokemon.types.length -1].type.name;          
        }

        return (           
            <div id="single-pokemon">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.state.pokemon.name}</li>
                    </ol>
                </nav>


                <div className="card">
                    <img src={pokemonImgUrl} className={`card-img-top type-${type}`} width="200px" alt="Card cap" />
                    <div className="card-body">
                        <h4 className="card-title">Update {this.state.pokemon.name}</h4>
                        <div className="card-text">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="candyCount">Candy Holding Count: </label>
                                    <input type="number" className="form-control" defaultValue={this.state.pokemon.candyCount || ''} name="candyCount"
                                        onInput={this.handleChange} />
                                </div>

                                <div className="form-group">
                                    <div className="form-check">
                                        <input type="checkbox" htmlFor="threeStars" className="form-check-input" id="threeStars" name="threeStars" defaultChecked={this.state.pokemon.threeStars}
                                            onClick={this.handleChange}
                                            value="false" />
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

                                <button type="submit" className="btn btn-primary float-right">Update</button>

                            </form>



                        </div>
                    </div>
                </div>
            </div>
        )
    }



}
export default withRouter(Pokemon); 