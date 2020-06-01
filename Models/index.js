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

var friendSchema = new mongoose.Schema({
    name: String,
    status: String,
    daysNextStatus: Number
});

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

var imagesSchema = new mongoose.Schema({
    idNumber: Number,
    iconType: Object,
    iconBase64: String, 
    fullType: Object,
    fullBase64: String
}); 

var images = mongoose.model("images", imagesSchema); 
var pokeDex = mongoose.model(collection, pokeDexSchema); 
var friends = mongoose.model("friends", friendSchema); 

module.exports = {
    pokeDex: pokeDex,
    images: images,
    friends: friends
}