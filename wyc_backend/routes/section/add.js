const db = require('../../database');
const Section = db.models.Section;
const ClassTeacher = db.models.ClassTeacher;

function add(req, res, next) {
    const data = req.body;
    Section.findOrCreate({
        defaults: {
            class_id: data.class_id,
            name: data.name,
            room_no: data.room_no
        },
        where: {
            class_id: data.class_id,
            name: data.name
        }
    }).then((section) => {
        return ClassTeacher.findOrCreate({
            defaults: {
                session_id: data.session_id,
                section_id: section[0].id,
                teacher_id: data.teacher_id,
                board_id: data.board_id,
                stream_id: data.stream_id
            },
            where: {
                session_id: data.session_id,
                section_id: section[0].id,
            }
        }).then((classTeacher) => {
            if (classTeacher[1]) {
                res.json({
                    status: true,
                    message: 'Section created successfully'
                });
            } else {
                res.json({
                    status: false,
                    message: 'Section already exists'
                });
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
