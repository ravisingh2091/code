const async = require('async');
const db = require('../../database');
const FeeClass = db.models.FeeClass;

function add(req, res, next) {
    async.eachSeries(req.body.options, (assign, callback) => {
        if (assign.id) {
            FeeClass.update(
                {
                    fee_structure_id: assign.fee_structure_id
                }, {
                    where: {
                        id: assign.id
                    }
                }).then(() => callback()).catch(() => callback());
        } else {            
            FeeClass.findOrCreate({
                defaults: {
                    session_id: req.body.session_id,
                    fee_structure_id: assign.fee_structure_id,
                    class_id: assign.class_id
                },
                where: {
                    session_id: req.body.session_id,
                    class_id: assign.class_id
                }
            }).then(() => callback()).catch(() => callback());
        }
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json(201, {
            status: true,
            message: 'Fee Structure assign successfully'
        });
    });
}

module.exports = add;
