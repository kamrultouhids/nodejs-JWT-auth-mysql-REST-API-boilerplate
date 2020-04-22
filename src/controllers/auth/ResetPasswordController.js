import bcrypt from 'bcrypt';
import sql from '../../functions/sql';
import currentDate from '../../functions/currentDate';
import commonValidations from '../../validations/commonValidations';

class ResetPasswordController {

    /**
     * Create a reset password code for  user
     * @param req
     * @param res
     * @returns {Promise<void>}
    */

    static async passwordForgot(req, res) {
        const { identifier } = req.body;
        const { errors, isValid } = commonValidations({identifier}, {
            identifier: 'required'
        });

        if (isValid) {
            const findUser = await sql.select('*').from('users').where({'phone': identifier}).first();
            if (findUser) {
                const date = currentDate();
                const reset_code = await sql('password_resets').insert({
                    user_id: findUser.id,
                    user_type: 1,
                    reset_code: Math.floor(100000 + Math.random() * 900000),
                    created_at: date,
                    updated_at: date,
                }, 'id');
                return response(req, res, {
                    status: true,
                    id: reset_code[0]
                }, 200);
            } else {
                return response(req, res, {
                    status: false,
                    msg: 'User not found.'
                }, 404);
            }
        } else {
            return response(req, res, errors, 400);
        }
    }

    /**
     * User forget password rest code match
     * @param req
     * @param res
     * @returns JSON Object
     */

    static async passwordForgotCodeMatch(req, res) {
        const { identifier, id, code } = req.body;
        const { errors, isValid } = commonValidations({identifier, id, code}, {
            identifier: 'required',
            id: 'required',
            code: 'required',
        });

        if (isValid) {
            const findUser = await sql.select('*').from('users').where({'phone': identifier}).first();
            if (findUser) {
                const findCode = await sql.select('*').from('password_resets').where({
                    'user_id': findUser.id,
                    'user_type': 1,
                    is_used: 0,
                    reset_code: code
                }).andWhereRaw('created_at >= NOW() - INTERVAL 5 MINUTE').first();
                if (findCode) {
                    return response(req, res, {
                        status: true,
                        findCode: findCode,
                        msg: 'Code matched.',
                    }, 200);
                } else {
                    return response(req, res, {
                        status: false,
                        msg: 'Code not matched. Please Try again!'
                    }, 404);
                }
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
     * User forget password rest & create new password
     * @param req
     * @param res
     * @returns JSON Object
    */

    static async passwordRest(req, res) {
        try {
            const { identifier, id, code, password, confirm_password } = req.body;
            const { errors, isValid } = commonValidations({identifier, id, code, password, confirm_password}, {
                identifier: 'required',
                id: 'required',
                code: 'required',
                password: 'required',
                confirm_password: 'required|confirm_password',
            });

            if (isValid) {
                const findUser = await sql.select('*').from('users').where({'phone': identifier}).first();
                if (findUser) {
                    const findCode = await sql.select('*').from('password_resets').where({
                        'user_id': findUser.id,
                        'user_type': 2,
                        is_used: 0
                    }).andWhereRaw('created_at >= NOW() - INTERVAL 10 MINUTE').first();
                    if (findCode) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(password, salt);
                        const rest_pass = await sql('users').where({'id': findUser.id}).update({password: hash});
                        sql('password_resets').where({'id': id}).update({is_used: 1}).then(() => {

                        });
                        return response(req, res, {
                            status: true,
                            msg: 'Password reset success.',
                        }, 200);
                    } else {
                        return response(req, res, {
                            status: false,
                            msg: 'Code not matched. Please Try again!'
                        }, 404);
                    }
                } else {
                    return response(req, res, {
                        status: false,
                        msg: 'User not found.'
                    }, 404);
                }
            } else {
                return response(req, res, {
                    status: false,
                    msg: 'Data not matched. Please Try again!',
                }, 404);
            }
        } catch (e) {
            return response(req, res, e, 404, {
                status: false,
                msg: 'Data not matched. Please Try again!',
            });
        }
    }
}

export default ResetPasswordController;