const db = require('../../database');
const Subject = db.models.Subject;

function add(req, res, next) {
    const subject = {
        name: req.body.name,
        branch_id: req.query.branch_id
    };

    Subject.findOrCreate({
        defaults: subject,
        where: subject
    }).then((data) => {
        if (data[1]) {
            return res.json(201, {
                status: true,
                message: 'subject created successfully'
            });
        }
        res.json(201, {
            status: false,
            message: 'subject already exits'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
