import setPokemonCandyDistance from './setPokemonCandyDistance';
import setPokemonHoldingList from './setPokemonHolding';
import jsonSettings from '../settings.json'; 
const mongoose = require('mongoose'); 
mongoose.connect(jsonSettings.connectionString,
 {useNewUrlParser: true, useUnifiedTopology: true}); 
var db = mongoose.connection; 

var argv = require('yargs')
    .usage('')
    .alias('sd', 'setDistances')
    .describe('sd', 'Replaces or adds all pokemon to db')
    .aliast('sh', 'setHoldings')
    .describe('sh', 'Replaces or adds default holding pokemon to db')
    .help('h')
    .alias('h', 'help')
    .argv; 

if(argv.setDistances)
    setPokemonCandyDistance(db); 
if(argv.setHoldings)
    setPokemonHoldingList(db); 