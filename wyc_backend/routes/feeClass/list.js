const db = require('../../database');
const FeeClass = db.models.FeeClass;
const FeeStructure = db.models.FeeStructure;
const Class = db.models.Class;

function get(req, res, next) {
    FeeClass.findAll({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: FeeStructure,
            as: 'feeStructure'
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Class,
            as: 'class'
        }],
        where: {
            session_id: req.query.session_id
        },
        order: 'class.sort'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Fee class listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
