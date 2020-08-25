const db = require('../../database');
const Stops = db.models.Stops;

function add(req, res, next) {
    const data = req.body;
    Stops.findOrCreate({
        defaults: {
            branch_id: req.query.branch_id,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            stu_one_fee: data.stu_one_fee,
            stu_both_fee: data.stu_both_fee,
            teach_one_fee: data.teach_one_fee,
            teach_both_fee: data.teach_both_fee,
            description: data.description
        },
        where: {
            branch_id: req.query.branch_id,
            name: data.name
        }
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Stop added successfully'
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

module.exports = add;
