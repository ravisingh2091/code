const db = require('../../database');
const Weekoff = db.models.WeekOff;

function del(req, res, next) {
    Weekoff.destroy({
        where: { id: req.params.id }
    }).then(() => {
        return res.json({
            status: true,
            message: 'Weekoff removed form calendar successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
