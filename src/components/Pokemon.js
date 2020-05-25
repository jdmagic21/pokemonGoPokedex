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
    componentDidMount()
    {
        const id = this.props.match.params.id;
        fetch(`/pokemon/${id}`).then(res => res.json())
            .then(pokemon => this.setState({ pokemon: pokemon[0] }));

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
        var idStr = this.state.pokemon.idNumber;
        if (this.state.pokemon.idNumber < 10)
        {
            idStr = "00" + this.state.pokemon.idNumber;
        }
        else if (this.state.pokemon.idNumber < 100)
        {
            idStr = "0" + this.state.pokemon.idNumber;
        }

        const pokemonImgUrl = "https://db.pokemongohub.net/images/official/full/" + idStr + ".png";

        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{this.state.pokemon.name}</li>
                    </ol>
                </nav>


                <div class="card">
                    <img className="card-img-top" src={pokemonImgUrl} width="200px" alt="Card cap" />
                    <div class="card-body">
                        <h4 class="card-title">Update {this.state.pokemon.name}</h4>
                        <div class="card-text">
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