const db = require('../../database');
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;

function update(req, res, next) {
    const data = req.body;
    ExtraExpenditureHead.findOne({
        where: {
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((head) => {
        if (!head) {
            return ExtraExpenditureHead.update({ name: data.name,description:data.description, status:data.status}, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Head updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Head name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
