const commonSchool = require('../../common/school');
const db = require('../../database');
const Branch = db.models.Branch;
const School = db.models.School;

function list(req, res, next) {
    const whereCondition = {};
    if (req.query.school_id) {
        whereCondition.school_id = req.query.school_id;
    }

    Promise.all([
        Branch.findAll({
            attributes: ['id', 'branch', 'principal_name', 'email', 'primary_no', 'logo', 'website', 'street', 'city', 'state', 'country', 'pincode', 'remaining_msg'],
            include: [{
                required: true,
                model: School,
                as: 'school'
            }],
            where: whereCondition
        }),
        commonSchool.employeeCount(),
        commonSchool.studentCount()
    ]).then(([schoolInfo, employeeCount, studentCount]) => {
        return getFinalResult(schoolInfo, employeeCount, studentCount, (result) => {
            res.json({
                status: true,
                message: 'Branch listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;


function getFinalResult(schoolInfo, employeeCount, studentCount, callback) {
    const finalArray = [];
    schoolInfo.forEach(element => {
        const stuCountObj = studentCount.find((row) => { return row.session.branch_id === element.id; });
        const stuCount = stuCountObj ? stuCountObj.get().no_of_student : 0;

        const empCountObj = employeeCount.find(row => row.branch_id === element.id);
        const empCount = empCountObj ? empCountObj.get().no_of_employee : 0;

        finalArray.push({
            'id': element.id,
            'school_id': element.school.id,
            'school_name': element.school.name,
            'branch': element.branch,
            'principal_name': element.principal_name,
            'email': element.email,
            'primary_no': element.primary_no,
            'logo': element.logo,
            'website': element.website,
            'street': element.street,
            'city': element.city,
            'state': element.state,
            'country': element.country,
            'pincode': element.pincode,
            'remaining_msg': element.remaining_msg,
            'stu_count': stuCount,
            'emp_count': empCount
        });
    });

    return callback(finalArray);
}
