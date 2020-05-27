var kmToMiles = require('../Services/kmToMiles.js'); 

test('converts kilometers to miles', ()=>{ 
    expect(kmToMiles(1.23432)).toEqual(0.77);     
});