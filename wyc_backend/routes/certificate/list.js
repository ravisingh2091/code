const utils = require('../../lib/utils');
const db = require('../../database');
const Certificate = db.models.Certificate;

function list(req, res, next) {
    const whereCondition = {
        branch_id: req.query.branch_id
    };  Certificate.findAll({
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Certificate listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
