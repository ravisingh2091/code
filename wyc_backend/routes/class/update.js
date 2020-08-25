const db = require('../../database');
const Class = db.models.Class;

function update(req, res, next) {
    Class.find({
        where: {
            name: req.body.name,
            branch_id: req.query.branch_id,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return Class.update({
                name: req.body.name,
                sort: req.body.class_order,
                status: req.body.status
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Class updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Class already exits'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
