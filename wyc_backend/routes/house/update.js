const db = require('../../database');
const House = db.models.House;

function update(req, res, next) {
    House.find({
        where: {
            name: req.body.name,
            branch_id: req.query.branch_id,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return House.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'House updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'House already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
