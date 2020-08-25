const db = require('../../database');
const FeeHead = db.models.FeeHead;

function update(req, res, next) {
    const data = req.body;
    FeeHead.find({
        where: {
            name: data.name,
            id: {
                $not: data.id
            }
        }
    }).then((result) => {
        if (!result) {
            return FeeHead.update({ name: data.name }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Fee head updated successfully'
                });
            });
        }
        return res.json({
            status:false,
            message: 'Fee head already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
