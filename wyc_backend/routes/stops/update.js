const db = require('../../database');
const Stops = db.models.Stops;

function update(req, res, next) {
    const data = req.body;
    Stops.findOne({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            id: { $ne: data.id }
        }
    }).then((result) => {
        if (!result) {
            return Stops.update({
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                stu_one_fee: data.stu_one_fee,
                stu_both_fee: data.stu_both_fee,
                teach_one_fee: data.teach_one_fee,
                teach_both_fee: data.teach_both_fee,
                description: data.description
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Stop info updated succesfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Stop name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
