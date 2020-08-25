const db = require('../../database');
const Class = db.models.Class;

function add(req, res, next) {
    Class.findOne({
        where: {
            branch_id: req.query.branch_id,
            sort: req.body.class_order
        }
    }).then((validateOrder) => {
        if (!validateOrder) {
            return Class.findOrCreate({
                defaults: {
                    branch_id: req.query.branch_id,
                    name: req.body.name,
                    sort: req.body.class_order
                },
                where: {
                    branch_id: req.query.branch_id,
                    name: req.body.name
                }
            }).then((data) => {
                if (data[1]) {
                    return res.json({
                        status: true,
                        message: 'Class created successfully'
                    });
                }
                return res.json({
                    status: false,
                    message: 'Class name already exists'
                });
            });
        } 
        return res.json({
            status: false,
            message: 'Class order already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
