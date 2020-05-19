const pokeDistance = require('../Models/').pokeDistance;  
const constants = require('../constants.json'); 
const kmToMiles = require('../Services/kmToMiles').kmToMiles; 
const fetch = require('node-fetch'); 
const cheerio = require('cheerio');  

async function getPokemonCandyDistance(){
    return fetch(constants.candyDistancesUrl).then(res => res.text())
    .then(body => {      
        const $ = cheerio.load(body);
        const speciesWrap = $('.speciesWrap');
        let pokeArray = [];

        speciesWrap.each((index, element) =>
        {            
            const pTags = $(element).find('p');
            const km = parseInt(pTags.eq(1).text().trim().replace("km", ""));
            const miles = parseInt(kmToMiles(km).toFixed(2));
            const pokeName = pTags.eq(2).text().trim();          
            const pokeObj = new pokeDistance({
                name: pokeName,
                km: km,
                miles: miles
            });

            pokeArray.push(pokeObj); 
        }); 
        return pokeArray; 
    });
}

async function setPokemonCandyDistance(db){
        //db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', async()=>{
        const pokeCandyDistanceArray = await getPokemonCandyDistance(); 
            if(pokeCandyDistanceArray.length > 0){
                await pokeDistance.deleteMany({}).exec(); 
                await pokeDistance.create(pokeCandyDistanceArray);
                db.close(); 
            }
            db.close(); 
        });
    }

module.exports = {
    getPokemonCandyDistance: getPokemonCandyDistance,
    setPokemonCandyDistance: setPokemonCandyDistance
}