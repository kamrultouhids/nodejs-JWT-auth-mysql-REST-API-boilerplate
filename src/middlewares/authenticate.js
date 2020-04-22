import jwt from 'jsonwebtoken';
import config from '../functions/config';
import sql from '../functions/sql';

export default (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        let token;
        if (authorizationHeader) {
            token = authorizationHeader.split(' ')[1];
        }
        if (token) {
            jwt.verify(token, config.jwtSecret, (err, decode) => {
                if (err) {
                    res.status(401).json({errors: {global: 'Failed to authenticate'}});
                } else {
                    const users = sql.select('*').from('users').where('id', decode.id).where('phone', decode.phone).first().then(function (user) {
                        if (user) {
                            req.currentUser = user;
                            next();
                        } else {
                            res.status(401).json({errors: {form: 'Invalid Credentials'}});
                        }
                    });
                }
            });
        } else {
            res.status(403).json({
                errors: {global: 'No token provided'}
            });
        }
    } catch (e) {
        res.status(401).json({errors: {global: 'Failed to authenticate'}});
    }


}