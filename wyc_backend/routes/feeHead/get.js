const db = require('../../database');
const FeeHead = db.models.FeeHead;

function get(req, res, next) {
    FeeHead.findOne({
        where: {
            id: req.query.head_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Fee head get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
