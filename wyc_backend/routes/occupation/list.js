const db = require('../../database');
const Occupation = db.models.Occupation;

function list(req, res, next) {
    Occupation.findAll().then((result) => {
        res.status(200).json({
            status: true,
            message: 'Occupation listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
