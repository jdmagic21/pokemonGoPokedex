const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs'); 
const path = require('path'); 
var HandlerGenerator = require('./handleGenerator').HandlerGenerator; 
var handlers = new HandlerGenerator(); 
let middleware = require('./middleware');
var cookieParser = require('cookie-parser');  

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
/* Middleware */ 
 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); 
const port = process.env.PORT || 3000; 

app.get('/login', (req, res)=>{
    res.sendFile(path.resolve(__dirname, '../public/login.html')); 
});

app.post('/authorize', handlers.login);

app.get('/', middleware.checkToken, handlers.index);
app.use(express.static(path.join(__dirname, '../build')));

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

app.get('/pokemon/image/:id', async(req, res)=>{
    const images = mongoose.model('images'); 
    const singlePokeImage = await images.find({idNumber: req.params.id}).exec(); 
    if(singlePokeImage.length > 0){
        console.log('trying to send')
        return res.json(singlePokeImage[0]);
    }
    else{
        return res.status(500).json(null); 
    } 
   
});

app.get('/pokemon/:id', async (req, res) =>
{
    const singlePoke = await pokeDex.find({idNumber: req.params.id}).exec();
    if(singlePoke.length > 0){
        res.json(singlePoke[0]);
    }
    else{
        return res.status(500).json(null);
    }
  
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
            poke.candyRemaining = undefined; 
        }        
        
        await poke.save();
        res.json(poke);
    }
    else
    {
        res.send(`Pokemon could not be updated`);
    }
});

app.get('/friends', async(req, res)=>{
    const friends = mongoose.model('friends'); 
    const filter = {
        __v: 0
    }
    const all = await friends.find({}, filter).exec(); 
    if(all.length > 0){
        res.json(all); 
    }
    else{
        res.status(500).json(null); 
    }    
}); 
app.get('/friends/:id', async(req, res)=>{
    const friends = mongoose.model('friends'); 
    const singleFriend = await friends.find({name: req.params.name}).exec(); 
    if(singleFriend > 0){
        res.json(singleFriend[0]); 
    }
    else{
        return res.status(500).json(null); 
    }
})

app.post('/friends/add', async(req, res)=>{
    console.log(req.body); 
    const friends = mongoose.model('friends'); 

    //find a friend by a name, if not found upsert
    friends.findOneAndUpdate({name: req.body.name}, 
        {
            name: req.body.name, 
            status: req.body.status,
            daysNextStatus: req.body.daysNextStatus
        }, {upsert: true}, (err, doc)=>{
            if(err) return res.send(500, {error: err}); 
            return res.status(200).send("successfully saved"); 
        });    
}); 
app.get('/friends/update', async(req,res)=>{
    const friends = mongoose.model('friends'); 
    var friend = await friends.findOne({name: req.body.name}); 
    if(friend != null){
        friend.name = req.body.name; 
        friend.status = req.body.status;
        friend.daysNextStatus = req.body.daysNextStatus;
        await friend.save(); 
        res.status(204).json(friend); 
    }
    else{
        res.status(500).json(null); 
    } 
});

app.get('/friends/delete', async(req,res)=>{
    const friends = mongoose.model('friends'); 
    const deleteFriend = await friends.deleteOne({name: res.body.name}); 
    if(deleteFriend === 1){
        res.status(204); 
    }
    else{
        res.status(500); 
    }   
}); 

app.get('*', middleware.checkToken, handlers.index);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));