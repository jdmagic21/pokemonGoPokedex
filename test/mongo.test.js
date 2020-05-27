const {MongoClient} = require('mongodb'); 
const argv = require('yargs').argv; 

const cs = argv.cs; 
console.log(process.env); 
//return arguments from node run


describe('Database', ()=>{
    let connection;
    let db; 

beforeAll(async ()=>{
    connection = await MongoClient.connect(cs,{
        useNewUrlParser: true,
        useUnifiedTopology: true
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


