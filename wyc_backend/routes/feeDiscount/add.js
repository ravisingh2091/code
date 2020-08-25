const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const FeeDiscount = db.models.FeeDiscount;

function add(req, res, next) {
    const data = req.body;

    async.eachSeries(data.month, (discount, callback) => {
        FeeDiscount.create({
            student_section_id: data.student_section_id,
            description: data.description,
            amount: data.amount,
            date: utils.formatDate(discount.date),
            type: data.type
        }).then(() => { return callback(); });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Fee discount added successfully'
        });
    });
}

module.exports = add;
