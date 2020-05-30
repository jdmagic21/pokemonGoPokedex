const getPokemon = require('./setPokemonImages').getPokemon;
const numberPadding = require('../src/setIdPadding');

test('should return a list of pokemon', async()=>{
    const pokemon = await getPokemon(); 
    expect(pokemon.length).toBeGreaterThan(1); 
}); 

test('number less than 10 return 00X', ()=>{
    expect(numberPadding.setIdNumberPadding(9)).toEqual("009"); 
    expect(numberPadding.setIdNumberPadding(10)).toEqual("010"); 
}); 

test('number less than 100 return 0XX', ()=>{
    expect(numberPadding.setIdNumberPadding(99)).toEqual("099"); 
    expect(numberPadding.setIdNumberPadding(100)).toEqual(100); 
}); 