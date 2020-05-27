const {MongoClient} = require('mongodb'); 
const fs = require('fs'); 
const path = require('path'); 
const settingsPath = path.resolve(__dirname, '../settings.json'); 
var mongoConnectionString= ""

if(fs.existsSync(settingsPath)){
    const settings = require('../settings.json'); 
    mongoConnectionString = settings.connectionString;
}
else{
    mongoConnectionString = process.env.connectionString; 
}

describe('Database', ()=>{
    let connection;
    let db; 

beforeAll(async ()=>{
    connection = await MongoClient.connect(mongoConnectionString,{
        useNewUrlParser: true
    });
    db = await connection.db('pokemonGo') 
})
afterAll(async()=>{
    await connection.close();
});

test('returns pokemon from PokeDex collection',async()=>{
    const pokeDex = db.collection('pokeDex'); 
    const pokemon = await pokeDex.findOne({}); 
    expect(pokemon).not.toBeNull();  
}); 

}); 


