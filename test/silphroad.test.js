
const fetch = require('node-fetch');

test('Return buddy candy requirement object', async(done) =>{
    jest.setTimeout(10000); 
    fetch('https://thesilphroad.com/buddy-candy-requirements')
        .then(res=>res.text())
        .then(body=>{ 
            const speciesWrap = new RegExp(/class="speciesWrap"/);  
            const drowzee = new RegExp(/Drowzee/); 
            const tyranitar = new RegExp(/Tyranitar/); 
            const muk = new RegExp(/Muk/); 
            const km1 = new RegExp(/1km/);
            const km3 = new RegExp(/3km/); 
            const km5 = new RegExp(/5km/); 
            const km20 = new RegExp(/20km/);             

            expect(speciesWrap.test(body)).toBeTruthy();
            expect(drowzee.test(body)).toBeTruthy(); 
            expect(tyranitar.test(body)).toBeTruthy(); 
            expect(muk.test(body)).toBeTruthy(); 
            expect(km1.test(body)).toBeTruthy(); 
            expect(km3.test(body)).toBeTruthy(); 
            expect(km5.test(body)).toBeTruthy(); 
            expect(km20.test(body)).toBeTruthy(); 
            
            done(); 
        });       
}); 