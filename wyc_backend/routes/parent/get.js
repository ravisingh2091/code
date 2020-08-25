const db = require('../../database');
const Parent = db.models.Parent;

function get(req, res, next) {
    Parent.findById(req.query.parent_id).then((result) => {
        res.json({
            status: true,
            message: 'Parent info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
