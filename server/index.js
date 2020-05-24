const express = require('express');
const mongoose = require('mongoose');
const basicAuth = require('express-basic-auth'); 
const fs = require('fs'); 
const path = require('path'); 
const settingsPath = path.resolve(__dirname, '../settings.json'); 
var mongoConnectionString= ""
var usernameStr = "";
var passwordStr = ""; 

//if local use settings file, else if on production use heroku config var
if(fs.existsSync(settingsPath)){
    const settings = require('../settings.json'); 
    mongoConnectionString = settings.connectionString;
    usernameStr = settings.username; 
    passwordStr = settings.password;
}
else{
    mongoConnectionString = process.env.connectionString; 
    usernameStr = process.env.username;
    passwordStr = process.env.password; 
}

mongoose.connect(mongoConnectionString,
    { useNewUrlParser: true, useUnifiedTopology: true });

const pokeDex = require('../Models/index').pokeDex;
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();

/* Basic Authentication */ 
app.use(basicAuth({authorizer: myAutherizer, challenge: true})); 

function myAutherizer(username, password){
    const userMatches = basicAuth.safeCompare(username, usernameStr);
    const passwordmatches = basicAuth.safeCompare(password, passwordStr);
    return userMatches & passwordmatches; 
}; 

/* Middleware */ 
app.use(express.static(path.join(__dirname, '../build'))); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000; 

app.get('/', myAutherizer, (req,res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html')); 
});

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
        const candyCountInt = Number(req.body.candyCount); 
        poke.threeStars = req.body.threeStars;
        poke.needed = req.body.needed;
        
        if(candyCountInt > 0){
            const candyRemaining = poke.evolutionCost - candyCountInt; 
            poke.candyCount = candyCountInt; 
            poke.candyRemaining = candyRemaining; 
            poke.kmsRemaining = candyRemaining * poke.kms; 
            poke.milesRemaining = (candyRemaining * poke.miles).toFixed(2);
        }
        else
        {
            poke.candyCount = 0; 
            poke.kmsRemaining = undefined; 
            poke.milesRemaining = undefined; 
        }        
        
        await poke.save();
        res.json(poke);
    }
    else
    {
        res.send(`Pokemon could not be updated`);
    }
});

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));