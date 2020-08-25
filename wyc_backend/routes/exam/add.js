const db = require('../../database');
const Exam = db.models.Exam;

function add(req, res, next) {
    Exam.findOrCreate({
        defaults: {
            branch_id: req.query.branch_id,
            name: req.body.name
        },
        where: {
            branch_id: req.query.branch_id,
            name: req.body.name
        }
    }).then((result) => {
        if (result[1]) {
            res.json({
                status: true,
                message: 'Exam added successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Exam name already exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
