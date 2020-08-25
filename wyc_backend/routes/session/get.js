const db = require('../../database');
const Session = db.models.Session;

function get(req, res, next) {
    Session.findOne({
        where: {
            id: req.params.session_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Session get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
