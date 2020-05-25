# Pokémon Go Pokédex Web Application #
## Background
Pokémon Go is different than the original GameBoy games in that in order to evolve a Pokémon you have to collect enough candies. The number of candies needed vary between each Pokémon. When you catch a Pokémon you are awarded a collection of candies and when you transfer or essentially delete a Pokémon from your bag you are also awarded a single candy. The other way a trainer can receive candy is by walking with a Pokémon. The app will track by GPS the number of KM's you walk even when the app is not running. The distance requirement can very from 2KM to 20KM per candy.

## Motivation
To create a user friendly application that allows a trainer to see which Pokémon they should walk with next sorted by the number of miles required in which case they can quickly fill up their Pokédex.

## Screenshots
![Mobile Index View](https://i.imgur.com/JcPkFun.jpg)  ![Mobile View Update View](https://i.imgur.com/vA5Xsri.jpg)

## Installation/Setup Instructions
This app was originally built for use with the Mongo Atlas database service and hosting through Heroku. The app will either look for a settings.json file or use your servers configuration variables. Below is general outline of first steps for integration with your own database and hosting service.

1. `npm i`: Install all necessary dependencies
2. Create a settings.json file using the below sample dummy data
    - Keep this file hidden using the .gitignore file
```Json
{
    "connectionString": "url (atlas or ip address)", 
    "username": "username",
    "password": "password",
    "collection": "mongo db collection name"
}
```
3. Copy the above object properties name strings and create configuration variables.
4. Run seed data scrips in the below sequence<br/>
    a. `node /SeedData/index.js --sd` <br/>
    b. `node /SeedData/index.js --se` <br/>


## Workflow
Reference "Script Definitions" section were needed.
1. Run express server and development instance of React app. 
2. Make any needed changes
3. Stop express server and dev processes
4. Run `heroku local` if using Heroku to test before pushing
5. Build the react app
6. Push to your server

## Script Definitions
- `node /server/index.js`: Runs Express API script
- `yarn start`: Run app from the /build folder, but `yarn build` needs to be ran first
- `yarn build`: Builds the app for production to the `build` folder
- `yarn reactStart`:  Runs the app in the development mode independent of Express
- `yarn test`: Launches the test runner in the interactive watch mode.
- `heroku local`: Heroku local server instance to test before pushing to server
- `node SeedData/index.js -h`:Seed data to your database
    - `node /SeedData/index.js --sd`: Add all Pokémon and distances
    - `node /SeedData/index.js --se`: Add all Pokémon evolution requirements.

## Learning Objectives ##

## Resource Links ##
- [Create-react-app: running tests](https://facebook.github.io/create-react-app/docs/running-tests)
- [Create-react-app: deployment](https://facebook.github.io/create-react-app/docs/deployment)

