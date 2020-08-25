const db = require('../../database');
const SectionName = db.models.SectionName;

function get(req, res, next) {
    SectionName.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'Section name get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
