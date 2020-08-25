const db = require('../../database');
const School = db.models.School;

function list(req, res, next) {
    School.findAll().then((school) => {
        return res.json({
            status: true,
            message: 'School listed successfully',
            data: school
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
