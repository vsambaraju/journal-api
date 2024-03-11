const {sign, verify} = require('jsonwebtoken');
const config = require('../config');

function createToken(user){
    const accessToken = sign({username: user.username}, config.jwt.secret,{
        issuer: 'journal-api',
        subject: String(user.user_id),
        expiresIn: "30m"
    });
    return accessToken;
}

function verifyToken(req, res, next){
    //console.log(req);
    const accessToken = req.cookies['access-token'];
    try {
        const result = verify(accessToken, config.jwt.secret);
        if(result){
            console.log("Authenticated");
            return next();
        }else(
            res.status(401).json({error: "Not authenicated!"})
        )        
    } catch (error) {
        res.status(401).json({error: error.message})
    }
}


module.exports = {
    createToken,
    verifyToken
}