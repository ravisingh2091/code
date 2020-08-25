const db = require('../../database');
const Class = db.models.Class;
const CalendarClass = db.models.CalendarClass;
const FeeClass = db.models.FeeClass;
const Section = db.models.Section;

function del(req, res, next) {
    const class_id = req.query.id;

    Promise.all([
        Section.findOne({ where: { class_id } }),
        CalendarClass.findOne({ where: { class_id } }),
        FeeClass.findOne({ where: { class_id } }),
    ]).then(([section, calClass, feeClass]) => {
        if (!section && !calClass && !feeClass) {
            return Class.destroy({ where: { id: class_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Class deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Class assiged.So we cannot delete'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
