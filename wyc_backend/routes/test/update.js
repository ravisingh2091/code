const db = require('../../database');
const Test = db.models.Test;

function update(req, res, next) {
    const data = req.body;
    Test.findOne({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((exam) => {
        if (!exam) {
            return Test.update({ name: data.name }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Test name updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Test name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
