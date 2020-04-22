import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../functions/config';
import sql from '../../functions/sql';
import commonValidations from '../../validations/commonValidations';

class LoginController {

    /**
     * login user with user Credentials
     * @param req
     * @param res
     * @returns {Promise<void>}
    */

    static async login(req, res) {
        const { identifier, password } = req.body;
        const { errors, isValid } = commonValidations({identifier, password}, {
            identifier: 'required',
            password: 'required',
        });
		
        if (isValid) {
            sql.select('*').from('users').where('phone', identifier).first().then(function (data) {
                if (data && bcrypt.compareSync(password, data.password)) {
                    if (data.status === 0) {
                        return res.json({
                            status: false,
                            account_status: data.status
                        });
                    }
                    const token = jwt.sign({
                        id: data.id,
                        phone: data.phone
                    }, config.jwtSecret);
                    res.json({
                        status: true,
                        token: token
                    });
                } else {
                    res.status(401).json({errors: {global: 'Invalid Credentials'}});
                }
            });
        } else {
            res.status(400).json({errors});
        }
    }
}

export default LoginController;