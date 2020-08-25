const db = require('../../database');
const Religion = db.models.Religion;

function list(req, res, next) {
    Religion.findAll().then((result) => {
        res.status(200).json({
            status: true,
            message: 'Religion listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
