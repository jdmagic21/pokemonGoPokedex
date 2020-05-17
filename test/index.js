
import getCandyDistanceList from "../src/fetch-buddy-candy-req";
const should = require('should'); 

describe('fetch budy candy list url', ()=>{
    it('should return html that is not empty', async ()=>{
       const htmlResult = getCandyDistanceList(); 
        htmlResult.should.not.be.null(); 
    }); 
})

describe('Convert html buddy distnace list to JSON', ()=>{
    it('should return a list that is greater than 1', ()=>{

    });
})