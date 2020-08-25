const db = require('../../database');
const School = db.models.School;

function add(req, res, next) {
    const data = {
        name: req.body.name
    };
    School.findOrCreate({
        defaults: data,
        where: data
    }).then((school) => {
        if (school[1]) {
            return res.json({
                status: true,
                message: 'School created successfully'
            });
        }
        res.json({
            status: false,
            message: 'School name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
