const fetch = require('node-fetch');

//loop through all pokemon in the pokedex collection
async function getPokemon()
{
    return new Promise((resolve, reject) =>
    {
        fetch('/pokemon')
            .then(res => res.json())
            .then(pokemon =>
            {
                resolve(pokemon);
            })
            .catch((err)=>{
                reject(err); 
            });
    });
}

//for each pokemon fetch image from https://assets.thesilphroad.com/img/pokemon/icons/96x96/10.png

    //return the buffer for each image

    //convert the buffer to base64

    //return the type from the image

    //save file name to the images  96x96 collection as {id}.png

//for each pokemon fetch image from https://db.pokemongohub.net/images/official/full/10.png
    //if the id is less than 100 use "0" + id
    //if the id is less than 10 use "00"+id  

    //retun the buffer for each image
    //convert the buffer to base64
    //retun the file type from the image
    //save file name to db as {id.png}
    //save base64 string to the 475x475 collection

module.exports = {
    getPokemon
}