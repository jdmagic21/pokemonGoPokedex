const {MongoClient} = require('mongodb'); 
const fs = require('fs'); 
const path = require('path'); 
let cs; 
jest.useFakeTimers(); 
//check if there is a settings file and use this connection string, 
//or use the environment variable set in github. 

if( fs.existsSync(path.resolve(__dirname, '../settings.json')) ){
    var settings = require('../settings.json');
    cs = settings.connectionString; 
}
else{
    cs = process.env.MONGO_CONNECTION_STRING; 
}
describe('Database Connection', ()=>{
    let connection;
    let db; 

beforeAll(async ()=>{
    connection = await MongoClient.connect(cs,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    db = await connection.db('pokemonGo'); 
    
    

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