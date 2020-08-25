const db = require('../../database');
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeHead = db.models.FeeHead;

function getConfigureHead(req, res, next) {
    FeeStructureInfo.findAll({
        attributes: ['id', 'amount', 'first_due_date'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'periodicity'],
            model: FeeHead,
            as: 'feeHead'
        }],
        where: {
            session_id: req.query.session_id,
            fee_structure_id: req.query.structure_id,
            fee_category_id: req.query.category_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'configure heads listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getConfigureHead;
