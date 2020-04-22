import sql from '../functions/sql';

export default async (req, res, next) => {
    try {
        const {_lang = 'en'} = req.headers;
        const log = await sql('api_request_log').insert({
            url: req.originalUrl,
            request: JSON.stringify(req.body),
            auth_header: JSON.stringify(req.headers),
        }).returning('id');
        req._log_id = log[0]
        next();
    } catch (e) {
        next();
    }
}