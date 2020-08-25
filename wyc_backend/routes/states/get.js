const db = require('../../database');
const States = db.models.States;
const Countries = db.models.Countries;

function get(req, res, next) {
    Countries.findOne({ where: { name: req.query.name } }).then((country) => {
        States.findAll({ where: { country_id: country.id }, order: 'name' }).then((result) => {
            res.json({
                status: true,
                message: 'States listed successfully',
                data: result
            });
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = get;
