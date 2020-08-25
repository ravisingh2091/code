const db = require('../../database');
const Module = db.models.Module;

function list(req, res, next) {
    Module.findAll().then((module) => {
        res.json({
            status: true,
            message: 'module listed successfully',
            data: module
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
