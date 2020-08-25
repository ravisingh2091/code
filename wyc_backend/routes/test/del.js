const db = require('../../database');
const PatternTest = db.models.PatternTest;
const Test = db.models.Test;

function del(req, res, next) {
    PatternTest.find({ where: { test_id: req.query.id } }).then((test) => {
        if (!test) {
            return Test.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Test deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Test assign to pattern'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
