const async = require('async');
const db = require('../../database');
const SubTestMark = db.models.SubTestMark;

function add(req, res, next) {
    if (Array.isArray(req.body)) {
        async.eachSeries(req.body, (studentInfo, callback) => {
            async.eachSeries(studentInfo.marks, (testMarkInfo, cb) => {
                SubTestMark.findOrCreate({
                    defaults: {
                        schedule_sub_test_info_id: testMarkInfo.schedule_sub_test_info_id,
                        stu_sec_id: studentInfo.stu_sec_id,
                        mark: testMarkInfo.mark,
                        status: testMarkInfo.status
                    },
                    where: {
                        schedule_sub_test_info_id: testMarkInfo.schedule_sub_test_info_id,
                        stu_sec_id: studentInfo.stu_sec_id
                    }
                }).then(() => cb());
            }, callback());
        }, (err) => {
            if (err) {
                next(err);
            }
            res.json({
                status: true,
                message: 'Exam sub test mark added successfully'
            });
        });
    } else {
        async.eachSeries(req.body.marks, (testMarkInfo, callback) => {
            SubTestMark.findOrCreate({
                defaults: {
                    schedule_sub_test_info_id: req.body.schedule_sub_test_info_id,
                    stu_sec_id: testMarkInfo.stu_sec_id,
                    mark: testMarkInfo.mark,
                    status: testMarkInfo.status
                },
                where: {
                    schedule_sub_test_info_id: req.body.schedule_sub_test_info_id,
                    stu_sec_id: testMarkInfo.stu_sec_id
                }
            }).then(() => callback());
        }, (err) => {
            if (err) {
                next(err);
            }
            res.json({
                status: true,
                message: 'Exam sub test mark added successfully'
            });
        });
    }
}

module.exports = add;
