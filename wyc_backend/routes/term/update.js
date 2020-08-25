const db = require('../../database');
const Term = db.models.Term;

function update(req, res, next) {
    const data = req.body;
    Term.findOne({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((exam) => {
        if (!exam) {
            return Term.update({ name: data.name }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Term name updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Term name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
