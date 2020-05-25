let jwt = require('jsonwebtoken');
const fs = require('fs'); 
const path = require('path'); 
const settingsPath = path.resolve(__dirname, '../settings.json'); 
var secret = ""; 
if(fs.existsSync(settingsPath)){
  const settings = require('../settings.json'); 
  secret = settings.secret; 
}
else{
  secret = process.env.secret;
}

let checkToken = (req, res, next) => {
  let token = req.cookies.jwt; // Express headers are auto converted to lowercase

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
          return res.redirect('/login?errorCode=1'); 
      
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
      return res.redirect('/login?errorCode=2'); 
  }
};

module.exports = {
  checkToken: checkToken
}