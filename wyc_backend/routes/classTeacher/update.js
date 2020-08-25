const db = require('../../database'),
    Section = db.models.Section,
    ClassTeacher = db.models.ClassTeacher;

function update(req, res, next) {
    const data = req.body;

    Promise.all([
        Section.update({ room_no: data.room_no }, { where: { id: data.section_id } }),
        ClassTeacher.update({
            section_id: data.section_id,
            teacher_id: data.teacher_id,
            board_id: data.board_id,
            stream_id: data.stream_id,
            room_no: data.room_no
        }, { where: { id: data.id } })
    ]).then(() => {
        res.json({
            status: true,
            message: 'Section info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
