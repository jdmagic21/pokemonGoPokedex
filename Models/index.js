var mongoose = require('mongoose'); 
var fs = require('fs'); 
const path = require('path'); 
const settingsPath = path.resolve(__dirname, '../settings.json'); 
var collection = ""; 

if(fs.existsSync(settingsPath)){
    const settings = require('../settings.json'); 
    collection = settings.collection; 
}
else{
    collection = process.env.collection; 
}

var pokeDexSchema = new mongoose.Schema({
    idNumber: Number,
    name: String, 
    kms: Number, 
    miles: Number,
    evolutionCost: Number,
    evolvesInto: String,
    threeStars: Boolean,
    needed: Boolean,
    candyCount: Number,
    candyRemaining: Number,
    kmsRemaining: Number, 
    milesRemaining: Number
}, {collection: collection});


var pokeDex = mongoose.model(collection, pokeDexSchema); 

module.exports = {
    pokeDex: pokeDex
}