import sql from './sql';

export default  (req, res, data, status, data_alias = false) => {
    let user_res = data;
    if (data_alias !== false) {
        user_res = data_alias;
        data = {error: data.message};
    }
    try {
        if (req._log_id) {
            sql('api_request_log').where('id', req._log_id).update({
                response: JSON.stringify(data),
                response_status: status,
            }).then(function (data, err) {

            });
        }
        return res.status(status).json(user_res);
    } catch (e) {
        return res.status(status).json(user_res);
    }


}