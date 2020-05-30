const fetch = require('node-fetch');
const fileType = require('file-type'); 
const imageModel = require('../Models/').images; 
const idPadding = require('../src/setIdPadding').setIdNumberPadding; 

//loop through all pokemon in the pokedex collection
async function getPokemon()
{
    return new Promise((resolve, reject) =>
    {
        fetch('http://localhost:3000/pokemon')
            .then(res => res.json())
            .then(pokemon =>
            {
                resolve(pokemon);
            })
            .catch((err)=>{
                reject(err); 
            });
    });
}

//for each pokemon fetch image from https://assets.thesilphroad.com/img/pokemon/icons/96x96/10.png
async function upsertIconImages(db){
    const fetch96 = "https://assets.thesilphroad.com/img/pokemon/icons/96x96/";  
    return new Promise((resolve,reject)=>{
       db.on('error', console.error.bind(console, 'connection error')); 
        db.once('open', async()=>{
            const pokemonList =  await getPokemon(); 
            for(var a = 0; a <= pokemonList.length -1; a++){
                let idNumber = pokemonList[a].idNumber;                
                const response = await fetch(`${fetch96}${idNumber}.png`); 
                //return the buffer for each image
                const buffer = await response.buffer(); 
                //return the type from the image
                const type = await fileType.fromBuffer(buffer); 
                //convert the buffer to base64
                const base64String = Buffer.from(buffer).toString('base64');
                //console.log(base64String);                 

                imageModel.findOneAndUpdate({idNumber: idNumber}, {
                    idNumber: idNumber, 
                    iconType: type, 
                    iconBase64: base64String
                },{upsert: true}, (err, doc)=>{
                    if(err) reject(err); 

                    console.log(`updated pokemon #${idNumber} 96x96 image`); 
                });
                      
            }
            resolve();
        });
    }); 
  
}

async function upsertFullImages(db){
    return new Promise((resolve,reject)=>{
        const fetch475 = 'https://db.pokemongohub.net/images/official/full/';
       db.on('error', console.error.bind(console, 'connection error')); 
        db.once('open', async()=>{
            const pokemonList =  await getPokemon(); 
            for(var a = 0; a <= pokemonList.length -1; a++){
                let idNumber = idPadding(pokemonList[a].idNumber);                
                const response = await fetch(`${fetch475}${idNumber}.png`); 
                //return the buffer for each image
                const buffer = await response.buffer(); 
                //return the type from the image
                const type = await fileType.fromBuffer(buffer); 
                //convert the buffer to base64
                const base64String = Buffer.from(buffer).toString('base64');              

                imageModel.findOneAndUpdate({idNumber: idNumber}, {
                    idNumber: idNumber, 
                    fullType: type, 
                    fullBase64: base64String
                },{upsert: true}, (err, doc)=>{
                    if(err) reject(err); 

                    console.log(`updated pokemon #${idNumber} 475x475 image`); 
                });
                      
            }
            resolve();
        });
    });  
}

module.exports = {
    upsertIconImages,
    upsertFullImages,
    getPokemon    
}