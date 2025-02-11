require('dotenv').config();
const jwt = require('jsonwebtoken')


const isLoggedIn = (req, res)=>{
    const authToken = req.cookies.jwtToken;
       
    const secret_key = process.env.SECRET_KEY;
    try {
        jwt.verify(authToken, secret_key, (err, decoded)=>{
            // console.log(req.url)
            if(err){
                return res.status(404).send(`${err.message}--Re-directing to login page`)
            }else{
                // check the decoded credentials to check access rights
                // console.log(decoded)
                return res.status(200).send(decoded)
            }
        })    
    } catch (error) {
        res.send(error)
    }
}

module.exports = isLoggedIn;