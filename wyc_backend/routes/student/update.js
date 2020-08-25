const commonStudent = require('../../common/student');
const commonSchool = require('../../common/school');

function update(req, res, next) {
    const data = req.body;

    commonStudent.parentExist(data.contact_no, data.parent_id).then((parent) => {
        if (!parent) {
            return commonStudent.updateParent(data, data.parent_id).then(() => {
                return commonStudent.updateStudent(data).then(() => {
                    return commonStudent.updateStudentSection(data).then(() => {
                        // return commonSchool.updateUser(data.contact_no, data.parent_id, 'Parent').then(() => {
                        res.json({
                            status: true,
                            message: 'Student & Parent info updated successfully',
                        });
                        // });
                    });
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'Primary contact number already exists',
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
