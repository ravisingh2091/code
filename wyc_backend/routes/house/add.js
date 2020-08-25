const db = require('../../database');
const House = db.models.House;

function add(req, res, next) {
    const data = {
        name: req.body.name,
        branch_id: req.query.branch_id
    };

    House.findOrCreate({
        defaults: data,
        where: data
    }).then((house) => {
        if (house[1]) {
            return res.json({
                status: true,
                message: 'House added successfully!'
            });
        }
        res.json({
            status: false,
            message: 'House name already exist!'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
