import React from 'react';
import { withRouter } from "react-router-dom";
import { json } from 'body-parser';

class Pokemon extends React.Component {
    constructor() {
        super();
        this.state = {
            pokemon: {}
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        fetch("http://localhost:3001/pokemon/" + id).then(res => res.json())
            .then(pokemon => this.setState({ pokemon: pokemon[0] }));

    }

    render() {
        return (
            <div>
                <h1>Update Pokemon {this.state.pokemon.name}</h1>

                <form>
                    <div className="form-group">
                        <label for="candyCount">Candy Holding Count: </label>
                        <input type="number" className="form-control" value={this.state.pokemon.candyCount} name="candyCount" />
                    </div>

                    <div className="form-group">
                        <div className="form-check">
                        <input type="checkbox" for="threeStars" className="form-check-input" id="threeStars" name="threeStars" checked={this.state.pokemon.threeStars} />
                            <label for="threeStars" className="form-check-label">Three Stars </label>
                          
                        </div>
                    </div>
                    <div className="form-group">
                    <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="needed" name="needed" checked={this.state.pokemon.needed} />
                        <label for="needed">Needed: </label>
                       </div>
                    </div>

                <button type="submit" className="btn btn-primary">Update</button>

                </form>



            </div>
        )
    }



}
export default withRouter(Pokemon); 