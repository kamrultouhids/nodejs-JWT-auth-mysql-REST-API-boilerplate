import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../../functions/sql';
import config from '../../functions/config';
import response from '../../functions/response';
import currentDate from '../../functions/currentDate';
import commonValidations from '../../validations/commonValidations';

class RegisterController {

    /**
     * Register
     * @param req
     * @param res
     * @returns {Promise<void>}
    */

    static async register(req, res) {
        try {
            const { name, phone, password } = req.body;
            let { errors, isValid } = commonValidations({phone, name, password}, {
                name: 'required',
                phone: 'required',
                password: 'required',
            });
            if (!errors.phone) {
                const findUser = await sql.select('*').from('users').where({'phone': phone}).first();
                if (findUser) {
                    errors.phone = 'This mobile number already been used';
                    isValid = false;
                }
            }
			
            if (isValid) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                await sql.transaction(async trx => {
                    const userId = await trx('users').insert({'name': name, 'phone': phone, password: hash}, 'id');
                    const date = currentDate();
                    const reset_code = await trx('account_validation_code').insert({
                        user_id: userId,
                        user_type: 1,
                        code: Math.floor(100000 + Math.random() * 900000),
                        created_at: date,
                        updated_at: date,
                    }, 'id');
                });
                return response(req, res, {
                    status: true,
                }, 200);
            } else {
                return response(req, res, {
                    status: false,
                    error_type: 1001,
                    errors
                }, 400);
            }
        } catch (e) {
            return response(req, res, e, 500, {
                status: false,
                msg: 'Please, try again!'
            });
        }
    }

    /**
     * Account verification code send
     * @param req
     * @param res
     * @returns JSON Object
    */

    static async accountVerification(req, res) {
        const { phone, password, code } = req.body;
        const { errors, isValid } = commonValidations({phone, password, code}, {
            phone: 'required',
            code: 'required',
            password: 'required',
        });
		
        if (isValid) {
            const findUser = await sql.select('*').from('users').where({'phone': phone}).first();
            if (findUser) {
                const findCode = await sql.select('*').from('account_validation_code').where({
                    'user_id': findUser.id,
                    'user_type': 1,
                    is_used: 0,
                    code: code
                }).andWhereRaw('created_at >= NOW() - INTERVAL 5 MINUTE').first();
                if (findCode) {
                    sql('account_validation_code').where({'id': findCode.id}).update({is_used: 1}).then(() => {

                    });
                    await sql('users').where({'id': findUser.id}).update({status: 1});

                    if (bcrypt.compareSync(password, findUser.password)) {
                        if (findUser.status === 1) {
                            return response(req, res, {
                                status: false,
                                msg: 'You are blocked. Please contact with customer care.'
                            }, 400);
                        }
                        const token = jwt.sign({
                            id: findUser.id,
                            phone: findUser.phone
                        }, config.jwtSecret);
                        res.json({
                            status: true,
                            token: token
                        });
                    } else {
                        res.status(401).json({errors: {global: 'Invalid Credentials'}});
                    }
                    const token = jwt.sign({
                        id: findUser.id,
                        phone: findUser.phone
                    }, config.jwtSecret);

                    return response(req, res, {
                        status: true,
                        token: token
                    }, 200);
                } else {
                    return response(req, res, {
                        status: false,
                        msg: 'Code not matched. Please Try again!'
                    }, 404);
                }

                return response(req, res, {
                    status: true,
                }, 200);

            } else {
                return response(req, res, {
                    status: false,
                    msg: 'User not found.'
                }, 404);
            }
        } else {
            return response(req, res, {
                status: false,
                msg: 'Data not matched. Please Try again!'
            }, 404);
        }
    }

    /**
     * Account verification resend code
     * @param req
     * @param res
     * @returns {Promise<void>}
    */

    static async accountVerificationResend(req, res) {
        const { phone } = req.body;
        const { errors, isValid } = commonValidations({phone}, {
            phone: 'required',
        });
		
        if (isValid) {
            const findUser = await sql.select('*').from('users').where({'phone': phone}).first();
            if (findUser) {
                const date = currentDate();
                const reset_code = await sql('account_validation_code').insert({
                    user_id: findUser.id,
                    user_type: 1,
                    code: Math.floor(100000 + Math.random() * 900000),
                    created_at: date,
                    updated_at: date,
                }, 'id');

                return response(req, res, {
                    status: true,
                }, 200);

            } else {
                return response(req, res, {
                    status: false,
                    msg: 'User not found.'
                }, 404);
            }
        } else {
            return response(req, res, {
                status: false,
                msg: 'Data not matched. Please Try again!'
            }, 404);
        }
    }
}

export default RegisterController;