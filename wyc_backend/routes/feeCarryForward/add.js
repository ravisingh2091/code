const utils = require('../../lib/utils');
const db = require('../../database');
const FeeCarryForward = db.models.FeeCarryForward;

function add(req, res, next) {
    const data = req.body;

    FeeCarryForward.findOrCreate({
        defaults: {
            student_section_id: data.student_section_id,
            date: utils.getToday(),
            amount: data.amount
        },
        where: {
            student_section_id: data.student_section_id
        }
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Carry forward fee added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Carry forward fee already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
