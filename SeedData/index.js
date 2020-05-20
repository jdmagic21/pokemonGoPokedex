var setPokemonCandyDistance = require('./setPokemonCandyDistance').setPokemonCandyDistance;
var setPokemonEvolutionDistance = require('./setPokemonEvolutionCosts').setPokemonEvolutionDistance; 
var jsonSettings = require('../settings.json'); 
const mongoose = require('mongoose'); 
mongoose.connect(jsonSettings.connectionString,
 {useNewUrlParser: true, useUnifiedTopology: true}); 
var db = mongoose.connection; 

var argv = require('yargs')
    .usage('')
    .alias('sd', 'setDistances')
    .describe('sd', 'Replaces or adds all pokemon to db')
    .alias('se', 'setEvolutionCost')
    .describe('se', 'Add evolution costs for each pokemon to db')
    .help('h')
    .alias('h', 'help')
    .argv; 

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

