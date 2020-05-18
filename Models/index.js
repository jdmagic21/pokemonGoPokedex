var mongoose = require('mongoose'); 

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

var pokeList = mongoose.model('pokeList', pokeListSchema); 
var pokeDistance = mongoose.model('pokeDistance', pokeDistanceSchema); 

module.exports = {
    pokeList: pokeList.pokeList, 
    pokeDistance: pokeDistance.pokeDistance
}