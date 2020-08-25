const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const TransportDiscount = db.models.TransportDiscount;

function add(req, res, next) {
    const data = req.body;

    async.eachSeries(data.month, (discount, callback) => {
        TransportDiscount.create({
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
            message: 'Transport discount added successfully'
        });
    });
}

module.exports = add;
