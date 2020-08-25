const db = require('../../database');
const School = db.models.School;

function update(req, res, next) {
    School.find({
        where: {
            name: req.body.name,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return School.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'School name updated successfully'
                });
            }).catch((err) => {
                next(err);
            });
        }
        res.json({
            status: false,
            message: 'School name already exist'
        });
    });
}

module.exports = update;
