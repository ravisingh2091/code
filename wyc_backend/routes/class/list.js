const utils = require('../../lib/utils');
const db = require('../../database');
const Class = db.models.Class;

function list(req, res, next) {
    const whereCondition = {
        branch_id: req.query.branch_id
    };

    if (!req.query.status) {
        whereCondition.$not = { status: utils.DEACTIVE };
    }

    Class.findAll({
        where: whereCondition,
        order: ['sort']
    }).then((result) => {
        res.json({
            status: true,
            message: 'Class listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
