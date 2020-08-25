const commonExam = require('../../common/exam');

function list(req, res, next) {
    commonExam.getGradeList(req.query.branch_id).then((result)=>{
        res.json({
            status: true,
            message: 'Grades listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
    
}

module.exports = list;
