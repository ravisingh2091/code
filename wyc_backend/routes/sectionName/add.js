const db = require('../../database');
const SectionName = db.models.SectionName;

function add(req, res, next) {
    const data = {
        name: req.body.name,
        branch_id: req.query.branch_id
    };

    SectionName.findOrCreate({
        defaults: data,
        where: data
    }).then((section) => {
        if (section[1]) {
            return res.json({
                status: true,
                message: 'Section name added successfully!'
            });
        }
        res.json({
            status: false,
            message: 'Section name already exist!'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
