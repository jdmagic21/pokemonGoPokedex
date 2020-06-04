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
            pokemon: {},
        }
        this.indexedDB = window.indexedDB || window.webkitIndexedDB || 
        window.mozIndexedDB || window.msIndexedDB;
        this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    }

    async indexedDBRead(pokemonId){
        return new Promise((resolve, reject)=>{
            var request = this.indexedDB.open('pokedex');
        var db; 
        request.onsuccess = (evt) =>
        {             
            db = request.result;      
            if(this.IDBTransaction !== undefined){      
                var transaction = db.transaction("images");
                var objectStore = transaction.objectStore("images"); 
                var request2 = objectStore.get(parseInt(pokemonId)); 
                request2.onsuccess = (evt)=>{
                    resolve(request2.result); 
                }; 
            }       
        }
        });        
    }

    indexedDBCreate(pokemonObj){
        //this.indexedDbInit();   
        var request = this.indexedDB.open('pokedex');
        var db;    

        request.onsuccess = (evt)=>{
            db = request.result; 
             // write data to existing db 
        if(this.IDBTransaction !== undefined){
            var transaction = db.transaction("images", "readwrite"); 
            var objectStore = transaction.objectStore("images"); 
            // add data 
            var requestAdd = objectStore.add(pokemonObj); 

            requestAdd.onsuccess=function(evt){
                console.log('added new data'); 
            }
        }  
        }
       
    }

    indexedDbInit()
    {    
        if (this.indexedDB !== undefined)
        {
            var request = this.indexedDB.open('pokedex');
            request.onerror = (evt) =>
            {
                console.log('Database error code: ' + evt.target.errorCode);
            };
            request.onsuccess = (evt) =>
            {
                this.db = request.result;
            }
            request.onupgradeneeded = (evt) =>
            {
                var objectStore = evt.currentTarget.result.createObjectStore("images", { keyPath: "pokemonId", autoincrement: false });
                objectStore.createIndex("iconBase64", "iconBase64", { unique: true });
                objectStore.createIndex("iconType", "iconType", {unique: false}); 
                objectStore.createIndex("fullType", "fulltype", {unique:false}); 
                objectStore.createIndex("fullBase64", "fullBase64", {unique:true});               
            };            
        }
    }

    async componentDidMount()
    {
        this.indexedDbInit();    

        //check if there is a key in IndexDB with the given pokemon id
        //else if not, grab the image from the database using the /pokemon/image endpoint and add image to indexedDB

        const id = this.props.match.params.id;
        const pokemonStuff = await this.indexedDBRead(id);    
        
        var pokemon = await fetch(`/pokemon/${id}`).then(res => res.json());

        if(pokemon == null){
            this.setState({
                pokemon: false
            }); 
        }
        else{
            var types = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json());
            pokemon.types = types.types;   
            var images;
    
            if(pokemonStuff === undefined){
                images = await fetch(`/pokemon/image/${id}`).then(res => res.json());
                if(images != null){
                    var indexedDBObj = {
                        "pokemonId": images.idNumber,      
                        "iconBase64": images.iconBase64,
                        "iconType": images.iconType,
                        "fullType": images.fullType, 
                        "fullBase64": images.fullBase64          
                    }
                    this.indexedDBCreate(indexedDBObj); 
                }       
            }
            else{
                images = pokemonStuff; 
            }
            pokemon.images = images;
    
            this.setState({
                pokemon: pokemon
            });
        }      
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
            success: () =>
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
        var html = ""; 

        if (Object.keys(this.state.pokemon).length !== 0)
        {
            pokemonImgUrl = `data:${this.state.pokemon.images.fullType.mime || ""};base64,${this.state.pokemon.images.fullBase64 || ""}`;
            type = this.state.pokemon.types[this.state.pokemon.types.length - 1].type.name;
        }

        if(this.state.pokemon === false){
            html = (<div className="alert alert-danger" role="alert"><p>Pokemon with that ID does not exists</p></div>);
        }
        else if(Object.keys(this.state.pokemon).length !== 0){
            html = (
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
        return (
            <div>
            {html}
            </div>
        )
    }
}
export default withRouter(Pokemon); 