const db = require('../../database');
const Module = db.models.Module;

function add(req, res, next) {
    const data = {
        name: req.body.name
    };

    Module.findOrCreate({
        defaults: data,
        where: data
    }).then((module) => {
        if (module[1]) {
            return res.json({
                status: true,
                message: 'Module added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Module already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
