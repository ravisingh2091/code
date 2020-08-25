const db = require('../../database');
const FeeSchedule = db.models.FeeSchedule;
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeHead = db.models.FeeHead;

function getConfigureSchedule(req, res, next) {
    FeeSchedule.findAll({
        attributes: ['id', 'amount', 'due_date'],
        include: [{
            required: true,
            attributes: ['id'],
            model: FeeStructureInfo,
            as: 'feeStructureInfo',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: FeeHead,
                as: 'feeHead'
            }]
        }],
        where: {
            '$feeStructureInfo.session_id$': req.query.session_id,
            '$feeStructureInfo.fee_structure_id$': req.query.structure_id,
            '$feeStructureInfo.fee_category_id$': req.query.category_id
        },
        order: 'due_date'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Fee configure schedule list successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getConfigureSchedule;
