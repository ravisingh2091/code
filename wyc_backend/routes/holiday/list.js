const db = require('../../database');
const Holiday = db.models.Holiday;

function list(req, res, next) {
    Holiday.findAll({
        where: {
            session_id: req.query.session_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Holiday listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
