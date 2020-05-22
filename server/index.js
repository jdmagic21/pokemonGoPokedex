const express = require('express');
const jsonSettings = require('../settings.json');
const mongoose = require('mongoose');
mongoose.connect(jsonSettings.connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
const pokeDex = require('../Models/index').pokeDex;
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001;

app.get('/pokemon', async (req, res) =>
{
    const filter={
       __v: 0
    }

    if(req.query.sort == null){
        const all = await pokeDex.find({}, filter).sort({ name: 1 }).exec();
        res.json(all);
    }

    else if(req.query.sort === "milesRemaining"){
        const milesRemaining = await pokeDex.aggregate([{ $match: {"milesRemaining": {$exists:true}}}, {$sort: {milesRemaining: 1}}]).exec(); 
        const nonMilesRemaining = await pokeDex.aggregate([{ $match: {"milesRemaining": {$exists:false}}}, {$sort: {name: 1}}]).exec();
        res.json([...milesRemaining, ...nonMilesRemaining]);
    }

    else{
        var sort = {};       
        if(req.query.order === "desc"){
            sort[req.query.sort] = -1;
        }
        else if(req.query.order === "asc"){
            sort[req.query.sort] = 1;
        }
        else{
            sort[req.query.sort] = 1;
        }       

        const sortall = await pokeDex.find({}, filter).sort(sort).exec(); 
        res.json(sortall);       
    }   
});



app.get('/pokemon/:id', async (req, res) =>
{
    const singlePoke = await pokeDex.find({idNumber: req.params.id}).exec();
    res.json(singlePoke);
});

app.post('/pokemon/reset/:id', async (req, res) =>
{
    let poke = await pokeDex.findById(req.params.id).exec();

    if (poke != null)
    {
        poke.candyCount = 0;
        poke.threeStars = false;
        await poke.save();
        res.send(`Pokemon ${poke.name} has been reset`);
    }
    else
    {
        res.send(`Pokemon could not be found`);
    }
});

app.post('/pokemon/update', async(req, res) =>
{
    var poke = await pokeDex.findOne({idNumber: req.body.id});

    if (poke != null)
    {
        poke.candyCount = req.body.candyCount || poke.candyCount;
        poke.threeStars = req.body.threeStars || poke.threeStars;
        poke.needed = req.body.needed || poke.needed; 
        const candyRemaining = poke.evolutionCost - poke.candyCount; 
        if(candyRemaining > 0){
            poke.candyRemaining = candyRemaining; 
            poke.kmsRemaining = candyRemaining * poke.kms; 
            poke.milesRemaining = (candyRemaining * poke.miles).toFixed(2);
        }
        else
        {
            poke.candyRemaining = 0; 
            if(poke.evolutionCost != null){
                poke.kmsRemaining =  poke.evolutionCost * poke.kms; 
                poke.milesRemaining = (poke.evolutionCost * poke.miles).toFixed(2); 
            }     
        }        
        
        await poke.save();
        res.json(poke);
    }
    else
    {
        res.send(`Pokemon could not be updated`);
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));