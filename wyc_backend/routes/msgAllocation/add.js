const utils = require('../../lib/utils');
const db = require('../../database');
const MsgAllocation = db.models.MsgAllocation;
const Branch = db.models.Branch;

function add(req, res, next) {
    const data = req.body;
    Branch.findOne({ where: { id: data.branch_id } }).then((branchInfo) => {
        const remaining_msg = parseInt(branchInfo.remaining_msg) + parseInt(data.no_of_msg);
        return Promise.all([
            MsgAllocation.create({ branch_id: data.branch_id, no_of_msg: data.no_of_msg, date: utils.getToday() }),
            branchInfo.update({ remaining_msg }, { where: { id: data.branch_id } })
        ]).then(() => {
            res.json({
                status: true,
                message: 'Message allocated successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
