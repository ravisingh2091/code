const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;
const NoticeRecipient = db.models.NoticeRecipient;
const Employee = db.models.Employee;
const Section = db.models.Section;
const Class = db.models.Class;

function adminNotification(req, res, next) {
    NoticeRecipient.findAll({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'title', 'description', 'created_at'],
            model: NoticeBoard,
            as: 'noticeBoard',
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            }]
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Class,
                as: 'class'
            }]
        }],
        where: {
            '$noticeBoard.session_id$': req.query.session_id,
            '$noticeBoard.employee.type_id$': 4
        },
        order: 'noticeBoard.created_at DESC',
        limit: 20
    }).then((result) => {
        res.json({
            status: true,
            message: '',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = adminNotification;
