const db = require('../../database');
const ExamSection = db.models.ExamSection;
const ScheduleSection = db.models.ScheduleSection;

function update(req, res, next) {
    const data = req.body;
    ScheduleSection.findOne({
        where: {
            session_id: data.session_id,
            section_id: data.section_id
        }
    }).then((existData) => {
        if (!existData) {
            return ExamSection.update({
                pattern_id: data.pattern_id,
                non_exam_point: data.non_exam_point
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Section pattern updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Pattern already schedule for this section'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
