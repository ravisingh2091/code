const db = require('../../database');
const SectionName = db.models.SectionName;

function update(req, res, next) {
    SectionName.find({
        where: {
            name: req.body.name,
            branch_id: req.query.branch_id,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return SectionName.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Section updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Section already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
