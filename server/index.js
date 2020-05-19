const express = require('express');
const jsonSettings = require('../settings.json');
const mongoose = require('mongoose');
mongoose.connect(jsonSettings.connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
const pokeList = require('../Models/index').pokeList;
const pokeDistance = require('../Models/index').pokeDistance; 
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 
const port = 3000;

app.get('/pokemon/holding', async(req, res) =>
{
    const all = await pokeList.find({},{id: 1, name: 1, candyCount: 1, threeStars: 1}).sort({name: 1}).exec(); 
    res.json(all);
});
app.get('/pokemon/holding/:id', async(req, res)=>{
    const singlePoke = await pokeList.findById(req.params.id).exec();
    res.json(singlePoke);
});

app.get('/pokemon/distances', async(req,res)=>{
    const all = await pokeDistance.find({},{id:1, name: 1, km: 1, miles: 1}).sort({name: 1}).exec(); 
    res.json(all); 
}); 
app.get('/pokemon/distances/:id', async(req,res)=>{
    const singlePoke = await pokeList.findById(req.params.id).exec();
    res.json(singlePoke);
});

app.post('/pokemon/holding/reset/:id', async(req,res)=>{
    let poke = await pokeList.findById(req.params.id).exec(); 

    if(poke != null){
        poke.candyCount = 0; 
        poke.threeStars = false; 
        await poke.save(); 
        res.send(`Pokemon ${poke.name} has been reset`); 
    }
    else{
        res.send(`Pokemon could not be found`); 
    }
});

app.post('/pokemon/holding/update', async(req, res)=>{    
    let poke = await pokeList.findById(req.body.id).exec();
    if(poke != null){
        poke.candyCount = req.body.candyCount || poke.candyCount; 
        poke.threeStars = req.body.threeStars || poke.threeStars;
        await poke.save(); 
        res.send(`Pokemon ${poke.name} has been updated`); 
    }
    else{
        res.send(`Pokemon could not be updated`); 
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));