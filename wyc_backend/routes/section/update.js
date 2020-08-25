const db = require('../../database');
const Section = db.models.Section;
const ClassTeacher = db.models.ClassTeacher;

function update(req, res, next) {
    const data = req.body;

    Section.find({
        where: {
            class_id: data.class_id,
            name: data.name,
            $not: {
                id: data.id
            }
        }
    }).then((section) => {
        if (!section) {
            return Promise.all([
                Section.update({
                    name: data.name,
                    room_no: data.room_no,
                    status: data.status
                }, { where: { id: data.id } }),
                ClassTeacher.update({
                    teacher_id: data.teacher_id,
                    board_id: data.board_id,
                    stream_id: data.stream_id
                }, { where: { session_id: data.session_id, section_id: data.id } })
            ]).then(() => {
                res.json({
                    status: true,
                    message: 'Section info updated successfully'
                });
            }).catch((err) => {
                next(err);
            });
        }
        res.json({
            status: false,
            message: 'Section already exist in same class'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
