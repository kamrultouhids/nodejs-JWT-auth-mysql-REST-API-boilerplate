import sql from '../functions/sql';
import response from '../functions/response';
import currentDate from '../functions/currentDate';

class UserController {

    /**
     * Get all users
     * @param req
     * @param res
     * @returns {JSON Object}
     */

    static async index(req, res) {
        const  users = await sql('users').select('users.id', 'users.name', 'users.phone',
            'users.address', 'users.status', 'users.created_at', 'users.updated_at').whereNull('users.deleted_at');
        if (users.length > 0) {
            return response(req, res, {
                status: true,
                data: users
            }, 200);
        }
        return response(req, res, {
            status: false,
            msg: 'Users not found.'
        }, 404);
    }

    /**
     * Users status change by ID.
     * @param req
     * @param res
     * @returns {Promise<undefined>}
     */

    static async toggleStatus(req, res){
        const { id } = req.params;
        const date = currentDate();
        const shop = await sql('users').select('id', 'status').where({'id': id}).first();

        try {
            await sql('users').where({'id': id}).update({status: !shop.status, updated_at: date});
            return response(req,res,{
                success: true,
                message: "Success! Record updated."
            },200);
        } catch (e) {
            return response(req,res,e,400,{
                success: false,
                message: "Something wrong! Please, try again."
            });
        }
    }

}

export default UserController;