const fs = require('fs'); 
const path = require('path'); 

test('settings.json file exists', ()=>{
    const fileCheck = fs.existsSync(path.resolve(__dirname, '../settings.json')); 
    expect(fileCheck).toBeTruthy(); 
});