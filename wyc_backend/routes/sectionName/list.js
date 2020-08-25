const db = require('../../database');
const SectionName = db.models.SectionName;

function get(req, res, next) {
    SectionName.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json(200, {
            status: true,
            message: 'Section listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
