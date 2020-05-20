const pokeDex = require('../Models/').pokeDex;  
const constants = require('../constants.json'); 
const kmToMiles = require('../Services/kmToMiles').kmToMiles; 
const fetch = require('node-fetch'); 
const cheerio = require('cheerio');  

async function getPokemonCandyDistance(){
    return fetch(constants.candyDistancesUrl).then(res => res.text())
    .then(async(body) => {      
        const $ = cheerio.load(body);
        const speciesWrap = $('.speciesWrap');
        let pokeArray = [];

        for(var a = 0; a < speciesWrap.length; a++){
            const pTags = $(speciesWrap[a]).find('p');
            const idNumber = parseInt(pTags.eq(0).text().trim().replace("#", "")); 
            const km = parseInt(pTags.eq(1).text().trim().replace("km", ""));
            const miles = kmToMiles(km).toFixed(2);
            const pokeName = pTags.eq(2).text().trim();   
            let poke = await pokeDex.findOne({"name": pokeName}).exec(); 
            
            if(poke == null){
                const pokeObj = new pokeDex({
                    idNumber: idNumber,
                    name: pokeName,
                    kms: km,
                    miles: miles,
                    threeStars: false, 
                    candyCount: 0,
                    needed: false
                });         
    
                pokeArray.push(pokeObj); 
            }    
            else{
                poke.kms = km;
                poke.miles = miles;
                await poke.save(); 
            }  
        }
        return pokeArray; 
    });
}

async function setPokemonCandyDistance(db){
    return new Promise((resolve,reject)=>{
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', async()=>{
          
        const pokeCandyDistanceArray = await getPokemonCandyDistance(); 
            if(pokeCandyDistanceArray.length > 0){
                await pokeDex.create(pokeCandyDistanceArray);
                console.log('pokemon created');
                db.close();
                resolve(); 
            }
            else{
                console.log('no pokemon to create');
                db.close();
                resolve(); 
            }
        });
    }); 
    }

module.exports = {
    getPokemonCandyDistance: getPokemonCandyDistance,
    setPokemonCandyDistance: setPokemonCandyDistance
}