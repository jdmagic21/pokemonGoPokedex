var pokeList = require('../Models').pokeList; 
var getPokemonCandyDistance = require('./setPokemonCandyDistance').getPokemonCandyDistance;

async function getPokemonHoldingList(){
    const pokeCandyDistanceArray = await getPokemonCandyDistance(); 
    if(pokeCandyDistanceArray.length > 0){
        return pokeCandyDistanceArray.map(pokemon => {
            return new pokeList({
                name: pokemon.name, 
                candyCount: 0, 
                threeStars: false
            });
        });
    }
}

async function setPokemonHoldingList(db){
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async()=>{
    const pokeListArray = await getPokemonHoldingList();
        if(pokeListArray.length > 0){
            await pokeList.deleteMany({}).exec(); 
            await pokeList.create(pokeListArray);
            db.close(); 
        }
        db.close(); 
    });
}

module.exports = {
    getPokemonHoldingList: getPokemonHoldingList,
    setPokemonHoldingList: setPokemonHoldingList
}
