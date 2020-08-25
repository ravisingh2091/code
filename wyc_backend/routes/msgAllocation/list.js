const db = require('../../database');
const MsgAllocation = db.models.MsgAllocation;
const Branch = db.models.Branch;
const School = db.models.School;

function list(req, res, next) {
    MsgAllocation.findAll({
        include: [{
            required: true,
            attributes: ['id', 'branch', 'primary_no', 'sender_id', 'remaining_msg'],
            model: Branch,
            as: 'branch',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: School,
                as:'school'
            }]
        }],
        order:'created_at DESC'
    }).then((result) => {
        res.status(200).json({
            status: true,
            message: 'Message allocation info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
