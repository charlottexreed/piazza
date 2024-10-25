const { send } = require('express/lib/response')
const jsonwebtoken = require('jsonwebtoken')


// Verify token to verify the token is valid and they can access the feed, from the labs
function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token) {
        return res.status(401).send({message:'Access denied'})
    }

    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch {
        return res.status(401).send({message:'Invalid token'})
    }
}

module.exports = auth