const pokeDex = require('../Models/').pokeDex;  
const constants = require('../constants.json'); 
const fetch = require('node-fetch'); 
const cheerio = require('cheerio'); 

async function getPokemonEvolutionDistance(){
    return fetch(constants.evolutionsUrl).then(res=>res.text())
    .then(async(body) => {
        const $ = cheerio.load(body); 
        const evolutionWrapper = $('.infocard-list-evo'); 
        var pokemonArray = []; 
       
        evolutionWrapper.each((index,element)=>{
            const pokemon = $(element).find('.infocard .ent-name'); 
            const evolutionCost = $(element).find('.infocard-arrow span');            

            pokemon.each((index, poke)=>{
                var pokemonObj = { };
                pokemonObj.name = $(poke).text(); 

                if( $(pokemon[index+1]).text() !== ""){
                    pokemonObj.evolvesInto = $(pokemon[index+1]).text(); 
                }                
                if ($(evolutionCost[index]).text() !== ""){
                    pokemonObj.evolutionCost = $(evolutionCost[index]).text(); 
                }
                pokemonArray.push(pokemonObj); 
            });
        });

        pokemonArray = pokemonArray.filter(value => value.evolvesInto != null); 
        return pokemonArray; 
    });
}

async function setPokemonEvolutionDistance(db){
    return new Promise((resolve, reject)=>{
        db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',async()=>{
    const pokemonArray = await getPokemonEvolutionDistance();
    for(var a = 0; a < pokemonArray.length; a++){
        let poke = await pokeDex.findOne({"name": pokemonArray[a].name}).exec();    
            if(poke){
                poke.evolvesInto = pokemonArray[a].evolvesInto; 
                poke.evolutionCost = pokemonArray[a].evolutionCost;
                await poke.save(); 
                console.log(`Pokemon ${pokemonArray[a].name} updated`); 
            }                   
       }
       db.close();
       resolve(); 
    }); 
    }); 
    
}

module.exports = {
    getPokemonEvolutionDistance: getPokemonEvolutionDistance,
    setPokemonEvolutionDistance: setPokemonEvolutionDistance
}
