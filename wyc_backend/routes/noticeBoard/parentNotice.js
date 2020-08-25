const student = require('../../common/student');
const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;
const NoticeRecipient = db.models.NoticeRecipient;
const Employee = db.models.Employee;

function list(req, res, next) {
    const empWhereCondition = {};

    if (req.query.notice_type === 'Notification') {
        empWhereCondition.type_id = 4;
    } else {
        empWhereCondition.$not = {
            type_id: 4
        };
    }
    student.getStudentSection(req.query.student_id).then((studentInfo) => {
        NoticeRecipient.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                model: NoticeBoard,
                as: 'noticeBoard',
                include: [{
                    required: true,
                    attributes: ['id', 'first_name', 'last_name', 'type_id'],
                    model: Employee,
                    as: 'employee',
                    where: empWhereCondition
                }]
            }],
            where: {
                section_id: studentInfo.section_id,
                '$noticeBoard.session_id$': studentInfo.session_id
            },
            order: 'noticeBoard.id DESC'
        }).then((data) => {
            const noticeArray = [];
            data.forEach((notice) => {
                notice = notice.get();
                noticeArray.push({
                    id: notice.noticeBoard.id,
                    title: notice.noticeBoard.title,
                    description: notice.noticeBoard.description,
                    created_at: notice.noticeBoard.created_at,
                    updated_at: notice.noticeBoard.updated_at,
                    employee: {
                        id: notice.noticeBoard.employee.id,
                        first_name: notice.noticeBoard.employee.first_name,
                        last_name: notice.noticeBoard.employee.last_name,
                        type_id: notice.noticeBoard.employee.type_id
                    }
                });
            });

            res.json({
                status: true,
                message: 'Notice listed successfully',
                data: noticeArray
            });
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = list;
