const db = require('../../database');
const Module = db.models.Module;

function update(req, res, next) {
    Module.find({
        where: {
            name: req.body.name,
            $not: {
                id: req.body.id
            }
        }
    }).then((module) => {
        if (!module) {
            return Module.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Module updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'module already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
