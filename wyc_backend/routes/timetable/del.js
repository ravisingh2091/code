const db = require('../../database');
const Periods = db.models.Periods;
const Timings = db.models.Timings;
const Timetable = db.models.Timetable;

function del(req, res, next) {
    const section_id = req.query.section_id ? req.query.section_id : '';
    const table_id = req.query.id ? req.query.id : '';
    if (table_id !== '') {
        return Timings.findAll({
            attributes: ['id'],
            where: {
                timetable_id: table_id,
                $not: {
                    type: 'Break'
                }
            }
        }).then((timings) => {
            const timingIds = [];
            timings.forEach(element => {
                timingIds.push(element.id);
            });
            return Periods.destroy({ where: { timings_id: { $in: timingIds } } }).then(() => {
                return Timings.destroy({ where: { timetable_id: table_id } }).then(() => {
                    return Timetable.destroy({ where: { id: table_id } }).then(() => {
                        res.json({
                            status: true,
                            message: 'Timetable deleted successfully'
                        });
                    });
                });
            }).catch((err) => {
                next(err);
            });
        });
    }
    Periods.destroy({ where: { section_id } }).then(() => {
        res.json({
            status: true,
            message: 'Timetable deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
