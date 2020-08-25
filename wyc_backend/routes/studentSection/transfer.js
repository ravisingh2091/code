const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const User = db.models.User;
const UserSession = db.models.UserSession;

function transfer(req, res, next) {
    const data = req.body;
    Promise.all([
        StudentSection.update({ status: 'TRANSFER' }, { where: { id: data.id } }),
        Student.update({ status: 0 }, { where: { id: data.student_id } }),
        User.update({ status: 0 }, {
            where: {
                user_id: data.parent_id,
                type: 'Parent'
            }
        })
    ]).then(() => {
        UserSession.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: [],
                model: User,
                as: 'user'
            }],
            where: {
                '$user.user_id$': data.parent_id
            }
        }).then((userSession) => {
            if (userSession.length > 0) {
                return UserSession.destroy({
                    where: {
                        id: {
                            $in: userSession.map((row) => { return row.id; })
                        }
                    }
                }).then(() => {
                    return res.json({
                        status: true,
                        message: 'Student Transfer successfully'
                    });
                });
            }
            res.json({
                status: true,
                message: 'Student Transfer successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transfer;
