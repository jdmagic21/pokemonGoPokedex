let jwt = require('jsonwebtoken');
const config = require('../settings.json');

let checkToken = (req, res, next) => {
  let token = req.cookies.jwt; // Express headers are auto converted to lowercase

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
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