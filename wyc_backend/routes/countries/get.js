const db = require('../../database');
const Countries = db.models.Countries;

function get(req, res, next) {
    Countries.findAll().then((result) => {
        res.json({
            status: true,
            message: 'Countries listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
