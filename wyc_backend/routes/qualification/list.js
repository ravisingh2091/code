const db = require('../../database');
const Qualification = db.models.Qualification;

function list(req, res, next) {
    Qualification.findAll().then((result) => {
        res.status(200).json({
            status: true,
            message: 'Qualification listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
