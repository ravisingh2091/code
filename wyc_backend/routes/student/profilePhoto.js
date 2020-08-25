const fs = require('fs');
const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;

function profileImage(req, res, next) {
    const image = req.body.image;
    const id = req.body.id;

    StudentSection.findOne({ attributes: ['student_id'], where: { id: id } }).then((studentInfo) => {
        const student_id = studentInfo.student_id;
        const image_name = student_id + '.jpg';
        const path = './images/student/' + image_name;

        fs.writeFile(path, image, 'base64', function (err) {
            if (err) {
                return err;
            }
            Student.update({ photo: image_name }, { where: { id: student_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Student image uploaded successfully'
                });
            }).catch((err) => {
                next(err);
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = profileImage;
