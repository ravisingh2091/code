const db = require('../../database');
const FeeHead = db.models.FeeHead;

function list(req, res, next) {
    FeeHead.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        return res.json({
            status: true,
            message: 'Fee head listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
