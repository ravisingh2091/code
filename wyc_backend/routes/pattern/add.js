const async = require('async');
const db = require('../../database');
const Pattern = db.models.Pattern;
const PatternTerm = db.models.PatternTerm;
const PatternExam = db.models.PatternExam;
const PatternTest = db.models.PatternTest;

function add(req, res, next) {
    const data = req.body;
    Pattern.findOrCreate({
        defaults: {
            session_id: data.session_id,
            name: data.name,
            no_of_term: data.no_of_term,
            pass_percentage: data.pass_percentage,
            mark_type: data.mark_type
        },
        where: {
            session_id: data.session_id,
            name: data.name,
        }
    }).then((pattern) => {
        if (pattern[1]) {
            return async.eachSeries(data.terms, (termInfo, termCallBack) => {
                PatternTerm.create({
                    pattern_id: pattern[0].id,
                    term_id: termInfo.term_id,
                    pass_percentage: data.pass_percentage,
                    no_of_exam: termInfo.no_of_exam
                }).then((term) => {
                    async.eachSeries(termInfo.exams, (examInfo, examCallback) => {
                        PatternExam.create({
                            pattern_term_id: term.id,
                            exam_id: examInfo.exam_id,
                            no_of_test: examInfo.no_of_test,
                            test_consider: examInfo.test_consider,
                            max_mark: examInfo.max_mark,
                            pass_percentage: data.pass_percentage,
                            weightage: examInfo.weightage
                        }).then((exam) => {
                            async.eachSeries(examInfo.tests, (testInfo, testCallback) => {
                                PatternTest.create({
                                    pattern_exam_id: exam.id,
                                    test_id: testInfo.test_id,
                                    max_mark: examInfo.max_mark,
                                    pass_percentage: data.pass_percentage
                                }).then(() => {
                                    testCallback();
                                });
                            }, examCallback());
                        });
                    }, termCallBack());
                });
            }, (err) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    status: true,
                    message: 'Pattern created successfully'
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'Pattern name already exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
