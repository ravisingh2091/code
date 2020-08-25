const sequelize = require('sequelize');
const db = require('../../database');
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeStructure = db.models.FeeStructure;
const FeeCategory = db.models.FeeCategory;

function listFeeConfigure(req, res, next) {
    FeeStructureInfo.findAll({
        attributes: ['id', [sequelize.fn('count', sequelize.col('fee_head_id')), 'no_fee_head']],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: FeeStructure,
            as: 'feeStructure'
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: FeeCategory,
            as: 'feeCategory'
        }],
        where: {
            session_id: req.query.session_id
        },
        group: ['fee_structure_id', 'fee_category_id']
    }).then((result) => {
        res.json({
            status: true,
            message: 'Fee Configure listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listFeeConfigure;
