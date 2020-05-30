var setPokemonCandyDistance = require('./setPokemonCandyDistance').setPokemonCandyDistance;
var setPokemonEvolutionDistance = require('./setPokemonEvolutionCosts').setPokemonEvolutionDistance; 
var upsertIconImages = require('./setPokemonImages').upsertIconImages; 
var upsertFullImages = require('./setPokemonImages').upsertFullImages; 

var jsonSettings = require('../settings.json'); 
const mongoose = require('mongoose'); 
mongoose.connect(jsonSettings.connectionString,
 {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}); 
var db = mongoose.connection; 

var argv = require('yargs')
    .usage('')
    .alias('sii', 'setImagesIcon')
    .describe('sii', "inserts icon images for pokemon 96px x 96px")
    .alias('sif', 'setImagesFull')
    .describe('sif', "Insert full images for pokemon 475px x 475px")
    .alias('sd', 'setDistances')
    .describe('sd', 'Replaces or adds all pokemon to db')
    .alias('se', 'setEvolutionCost')
    .describe('se', 'Add evolution costs for each pokemon to db')
    .help('h')
    .alias('h', 'help')
    .argv; 

if(argv.setImagesIcon){
    (async()=>{
       
        await upsertIconImages(db).then(()=>{
            process.exit();  
        });
    })(); 
}

if(argv.setImagesFull){
    (async()=>{
       
        await upsertFullImages(db).then(()=>{
            process.exit();  
        });
    })(); 
}

if(argv.setDistances)
{
    (async()=>{
        await setPokemonCandyDistance(db).then(()=>{
            process.exit(); 
        });
        
    })();
}
 
if(argv.setEvolutionCost)
{
    (async()=>{
        setPokemonEvolutionDistance(db).then(()=>{
            process.exit(); 
        });
    })();  
}

