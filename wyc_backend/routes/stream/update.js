const db = require('../../database');
const Stream = db.models.Stream;

function update(req, res, next) {
    Stream.find({
        where: {
            branch_id: req.query.branch_id,
            name: req.body.name,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return Stream.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Stream updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Stream already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
