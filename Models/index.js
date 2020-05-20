var mongoose = require('mongoose'); 

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
    candyRemaining: Number
}, {collection: 'pokeDex'});


var pokeDex = mongoose.model('pokeDex', pokeDexSchema); 

module.exports = {
    pokeDex: pokeDex
}