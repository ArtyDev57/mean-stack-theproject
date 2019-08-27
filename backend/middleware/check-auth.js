const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'comrade_api', {});
        req.userdata = {email: decodedToken.email, userId: decodedToken.userId}
        next();
    } catch(err) {
        res.status(401).json({
            message: "Authentication Failed",
            error: err
        })
    }
}