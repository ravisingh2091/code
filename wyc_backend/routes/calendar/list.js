const db = require('../../database');
const Calendar = db.models.Calendar;

function list(req, res, next) {
    Calendar.findAll({
        where: {
            session_id: req.query.session_id
        }
    }).then((result) => {
        res.status(200).json({
            status: true,
            message: 'school calendar listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
