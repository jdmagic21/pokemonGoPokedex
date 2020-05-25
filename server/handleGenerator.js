const fs = require('fs'); 
const path = require('path'); 
const settingsPath = path.resolve(__dirname, '../settings.json');
let jwt = require('jsonwebtoken');

var usernameStr = "";
var passwordStr = ""; 
var secret = ""; 

//if local use settings file, else if on production use heroku config var
if(fs.existsSync(settingsPath)){
    const settings = require('../settings.json'); 
    usernameStr = settings.username; 
    passwordStr = settings.password;
    secret = settings.secret; 
}
else{
    usernameStr = process.env.username;
    passwordStr = process.env.password;
    secret = process.env.secret;  
}

class HandlerGenerator {
    login (req, res) {
      let username = req.body.username;
      let password = req.body.password;
      // For the given username fetch user from DB
      let mockedUsername = usernameStr;
      let mockedPassword = passwordStr;
  
      if (username && password) {
        if (username === mockedUsername && password === mockedPassword) {
          let token = jwt.sign({username: username},
            secret,
            { expiresIn: '24h' // expires in 24 hours
            }
          );
          // return the JWT token for the future API calls
          res.json({
            success: true,
            message: 'Authentication successful!',
            token: token
          });          
        } else {
          res.json({
            success: false,
            message: 'Incorrect username or password'
          });
        }
      } else {
        res.json({
          success: false,
          message: 'Authentication failed! Please check the request'
        });
      }
    }
    index (req, res) {
      res.sendFile(path.resolve(__dirname, '../build/index.html'));
    }
  }

  module.exports = {
    HandlerGenerator:HandlerGenerator
  }