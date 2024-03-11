const jwt= require('jsonwebtoken')

const dotenv =require('dotenv')

dotenv.config()


function jwtAuth(req, resp, next) {
    let token = req.headers.authorization;
    if (!token) {
      return resp
        .status(404)
        .json({ message: "unaothorization token is missing" });
    }
    token = token.split(" ")[1];

    // jwt token is verify apply

    jwt.verify(token, process.env.SECRET_KEY, (err, response) => {
      if (err) {
        return resp.status(401).json({ message: "auaothorizatio is invlaid" });
    }
    next();
    });
}


module.exports = {jwtAuth}