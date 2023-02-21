var jwt = require('jsonwebtoken');
const JWT_SECRET = "sakalaka boom boom"
const fetchuser = (req, res, next) => {
    //get user from token
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: "authentication error" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    }
    catch (error) {
        res.status(401)
    }
}


module.exports = fetchuser;