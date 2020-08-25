const db = require('../../database');
const Stream = db.models.Stream;

function list(req, res, next) {
    Stream.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.status(200).json({
            status: true,
            message: 'stream listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
