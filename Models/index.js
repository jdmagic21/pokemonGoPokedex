var mongoose = require('mongoose'); 

var pokeDexSchema = new mongoose.Schema({
    idNumber: Number,
    name: String, 
    kms: Number, 
    miles: mongoose.Types.Decimal128,
    evolutionCost: Number,
    evolvesInto: String,
    threeStars: Boolean,
    needed: Boolean,
    candyCount: Number
}, {collection: 'pokeDex'});


var pokeDex = mongoose.model('pokeDex', pokeDexSchema); 

module.exports = {
    pokeDex: pokeDex
}