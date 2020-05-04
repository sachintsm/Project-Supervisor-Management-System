const jwt = require('jsonwebtoken');
const config = require('./config/database');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    // console.log(req.header('auth-token'))
    if (!token){
        return res.status(400).send('Access Denied');
    }
    try {
        const verified = jwt.verify(token, config.secret);
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(400).send('Invalied Token');
    }
}