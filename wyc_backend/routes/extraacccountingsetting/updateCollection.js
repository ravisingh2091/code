const db = require('../../database');
const ExtraCollectionHead = db.models.ExtraCollectionHead;

function update(req, res, next) {
    const data = req.body;
    ExtraCollectionHead.findOne({
        where: {
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((head) => {
        if (!head) {
            return ExtraCollectionHead.update({ name: data.name,amount:data.amount,description:data.description, status:data.status}, { where: { id: data.id } }).then(() => {
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
