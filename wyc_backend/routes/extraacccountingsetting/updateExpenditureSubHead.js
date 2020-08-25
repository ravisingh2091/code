const db = require('../../database');
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;

function update(req, res, next) {
    const data = req.body;
    ExtraExpenditureSubHead.findOne({
        where: {
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((head) => {
        if (!head) {
            return ExtraExpenditureSubHead.update({ name: data.name,description:data.description,head_id:data.head_id, status:data.status}, { where: { id: data.id } }).then(() => {
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
