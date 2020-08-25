const db = require('../../database');
const Subject = db.models.Subject;

function get(req, res, next) {
    Subject.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'Subject get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
