const db = require('../../database');
const Class = db.models.Class;

function get(req, res, next) {
    Class.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'Class get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
