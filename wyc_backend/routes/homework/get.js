const student = require('../../common/student');
const utils = require('../../lib/utils');
const db = require('../../database');
const Homework = db.models.Homework;
const Subject = db.models.Subject;
const Employee = db.models.Employee;

function get(req, res, next) {
    const data = req.query;

    const whereCondition = {};
    if (data.subject_id) {
        const date = new Date();
        whereCondition.start_date = {
            $gte: utils.formatDate(date.setDate(date.getDate() - 7))
        };
        whereCondition.subject_id = data.subject_id;
    }

    if (data.date) {
        whereCondition.end_date = {
            $gte: data.date
        };
    }

    if (data.from_date && data.to_date) {
        whereCondition.start_date = {
            $gte: data.from_date,
            $lte: data.to_date
        };
    }

    student.getStudentSection(req.query.student_id).then((studentInfo) => {
        whereCondition.session_id = studentInfo.session_id;
        whereCondition.section_id = studentInfo.section_id;

        Homework.findAll({
            include: [
                {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                },
                {
                    required: true,
                    attributes: ['id', 'first_name', 'last_name'],
                    model: Employee,
                    as: 'employee'
                }
            ],
            where: whereCondition
        }).then((homework) => {
            res.json(200, {
                status: true,
                message: 'home work listed successfully1',
                data: homework
            });
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = get;
