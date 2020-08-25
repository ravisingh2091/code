const db = require('../../database');
const Subject = db.models.Subject;

function update(req, res, next) {
    const data = req.body;

    Subject.find({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            $not: {
                id: data.id
            }
        }
    }).then((subject) => {
        if (!subject) {
            return Subject.update({
                name: data.name
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Subject Updated Successfully'
                });
            }).catch((err) => {
                next(err);
            });
        }
        res.json({
            status: false,
            message: 'subject already exits'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
