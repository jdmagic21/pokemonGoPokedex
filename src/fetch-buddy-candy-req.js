const fetch = require('node-fetch');
const cheerio = require('cheerio');
var mongoose = require('mongoose'); 
mongoose.connect('mongodb+srv://jutt:VBBMRkZ3CyjIA5bF@cluster0-rw9vg.mongodb.net/pogoCandy?retryWrites=true&w=majority',
 {useNewUrlParser: true, useUnifiedTopology: true}); 
var db = mongoose.connection; 
var pokeDistanceSchema = new mongoose.Schema({
    name: String, 
    km: Number, 
    miles: Number
});
var pokeListSchema = new mongoose.Schema({
    name: String, 
    candyCount: Number, 
    threeStars: Boolean
});


var pokeDistance = mongoose.model('pokeCandy', pokeDistanceSchema); 
var pokeList = mongoose.model('pokeList', pokeListSchema); 

async function getCandyDistanceList()
{
    return fetch('https://thesilphroad.com/buddy-candy-requirements').then(res => res.text())
    .then(body => {      
    
        const $ = cheerio.load(body);
        const speciesWrap = $('.speciesWrap');
        let pokeArray = [];
        let pokeList = []; 

        speciesWrap.each((index, element) =>
        {
            const pTags = $(element).find('p');
            const km = parseInt(pTags.eq(1).text().trim().replace("km", ""));
            const miles = parseInt(kmToMiles(km).toFixed(2));
            const pokeName = pTags.eq(2).text().trim()           

            const pokeObj = new pokeDistance({
                name: pokeName,
                km: km,
                miles: miles
            });
            const pokeHolding = new pokeList({
                name: pokeName, 
                candyCount: 0, 
                threeStars: false
            });

            pokeArray.push(pokeObj);
            pokeList.push(pokeHolding); 

        });
        return {
            pokeArray,
            pokeList
        }
    });

}

function kmToMiles(km){
	return km * 0.62137; 
}

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{ 
    getCandyDistanceList().then(list => {
        if(list.length > 0){
            pokeDistance.deleteMany({}, ()=>{
                pokeDistance.create(list.pokeArray, (err)=>{
                    if(err) return console.err(err);
                }); 
            });
            pokeList.deleteMany({}, ()=>{
                pokeList.create(list.pokeList, (err)=>{
                    if(err) return console.err(err);                    
                });
            });          
        }      
    });
}); 