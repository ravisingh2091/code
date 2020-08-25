const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;
const Employee = db.models.Employee;

function list(req, res, next) {
    const whereCondition = {
        session_id: req.query.session_id
    };

    if (req.query.recipient_type === 'Employee') { // admin to teacher (Notice Board)
        whereCondition.recipient_type = 'Employee';
    } else if (req.query.recipient_type === 'Parent') { // teacher to parent (Notifications)
        whereCondition.sender_id = req.query.employee_id;
    } else { // admin to parent (Notice Board)
        whereCondition.recipient_type = 'Parent';
        whereCondition.$not = {
            '$employee.type_id$': 4
        };
    }

    NoticeBoard.findAll({
        include: [{
            required: true,
            attributes: ['first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }],
        where: whereCondition,
        order: 'id DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Notice listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
