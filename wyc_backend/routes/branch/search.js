const Sequelize = require('sequelize');
const db = require('../../database');
const connection = db.connection;
const Employee = db.models.Employee;

function search(req, res, next) {
    const searchText = req.query.text;
    const sqlQuery = 'SELECT A.id,A.section_id,A.roll_no, B.first_name,B.last_name,B.gender,B.admission_no, B.photo, B.status, C.father_name,C.mother_name, C.email,C.contact_no ,D.class_id,D.name ,E.name As classname FROM student_section AS A INNER JOIN student AS B ON A.student_id=B.id INNER JOIN parent AS C ON B.parent_id = C.id INNER JOIN section AS D ON A.section_id=D.id INNER JOIN class AS E ON D.class_id=E.id WHERE A.id IN(SELECT MAX(D.id) FROM student_section AS D INNER JOIN session AS E' +
        ' ON D.session_id = E.id WHERE E.branch_id = ' + req.query.branch_id + ' GROUP BY D.student_id) AND ' +
        '(B.first_name LIKE "%' + searchText + '%" OR' +
        ' B.last_name LIKE "%' + searchText + '%" OR' +
        ' B.aadhar_no LIKE "%' + searchText + '%" OR' +

        ' B.barcode LIKE "%' + searchText + '%" OR' +
        ' B.admission_no LIKE "%' + searchText + '%" OR' +
        ' C.father_name LIKE "%' + searchText + '%" OR' +
        ' C.mother_name LIKE "%' + searchText + '%" OR' +
        ' C.email LIKE "%' + searchText + '%" OR' +
        ' C.contact_no LIKE "%' + searchText + '%" OR' +
        ' D.name LIKE "%' + searchText + '%" OR' +
        ' E.name LIKE "%' + searchText + '%" OR' +
        ' (concat(B.first_name, " " , B.last_name) LIKE "%' + searchText + '%"))';

    Promise.all([
        connection.query(sqlQuery, { type: Sequelize.QueryTypes.SELECT }),
        // StudentSection.findAll({
        //     attributes: [[Sequelize.fn('MAX', Sequelize.col('StudentSection.id')), 'finalStu'], 'section_id'],
        //     include: [{
        //         required: true,
        //         attributes: ['id', 'admission_no', 'first_name', 'last_name', 'gender', 'photo'],
        //         model: Student,
        //         as: 'student',
        //         include: [{
        //             required: true,
        //             attributes: ['father_name', 'mother_name', 'email', 'contact_no'],
        //             model: Parent,
        //             as: 'parent'
        //         }]
        //     }, {
        //         required: true,
        //         attributes: ['id'],
        //         model: Session,
        //         as: 'session'
        //     }],
        //     where: {
        //         $or: [
        //             Sequelize.where(Sequelize.fn('concat', Sequelize.col('student.first_name'), ' ', Sequelize.col('student.last_name')), {
        //                 like: '%' + searchText + '%'
        //             }),
        //             { '$student.first_name$': { $like: '%' + searchText + '%' } },
        //             { '$student.last_name$': { $like: '%' + searchText + '%' } },
        //             { '$student.aadhar_no$': { $like: '%' + searchText + '%' } },
        //             { '$student.barcode$': { $like: '%' + searchText + '%' } },
        //             { '$student.parent.father_name$': { $like: '%' + searchText + '%' } },
        //             { '$student.parent.mother_name$': { $like: '%' + searchText + '%' } },
        //             { '$student.parent.email$': { $like: '%' + searchText + '%' } },
        //             { '$student.parent.contact_no$': { $like: '%' + searchText + '%' } }
        //         ],
        //         '$session.branch_id$': req.query.branch_id
        //     },
        //     group: ['student_id']
        // }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'father_name', 'contact_no', 'email', 'gender', 'photo', 'status'],
            where: {
                $or: [
                    Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                        like: '%' + searchText + '%'
                    }),
                    { first_name: { $like: '%' + searchText + '%' } },
                    { last_name: { $like: '%' + searchText + '%' } },
                    { contact_no: { $like: '%' + searchText + '%' } },
                    { email: { $like: '%' + searchText + '%' } },
                    { aadhar_no: { $like: '%' + searchText + '%' } },
                    { barcode: { $like: '%' + searchText + '%' } }
                ],
                branch_id: req.query.branch_id
            }
        })
    ]).then(([searchStudent, searchEmployee]) => {
        const result = [];
        searchStudent.forEach((student) => {
            result.push({
                id: student.id,
                type: 'Student',
                section_id: student.section_id,
                roll_no: student.roll_no,
                admission_no: student.admission_no,
                first_name: student.first_name,
                last_name: student.last_name,
                gender: student.gender,
                father_name: student.father_name,
                mother_name: student.mother_name,
                email: student.email,
                contact_no: student.contact_no,
                photo: student.photo,
                name: student.name,
                classname: student.classname,
               

                status: student.status
            });
        });

        searchEmployee.forEach((employee) => {
            employee = employee.get();
            result.push({
                id: employee.id,
                type: 'Employee',
                first_name: employee.first_name,
                last_name: employee.last_name,
                father_name: employee.father_name,
                //mother_name: employee.mother_name,
                email: employee.email,
                contact_no: employee.contact_no,
                gender: employee.gender,
                photo: employee.photo,
                status: employee.status
            });
        });

        res.json({
            status: true,
            message: 'Search listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = search;
