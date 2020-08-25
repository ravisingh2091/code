const db = require('../../database');
const Nationality = db.models.Nationality;

function get(req, res, next) {
    Nationality.findAll().then((result) => {
        res.json({
            status: true,
            message: 'Nationality listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
