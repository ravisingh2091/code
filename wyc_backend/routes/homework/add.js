const pushNotification = require('../../common/pushNotification');
const utils = require('../../lib/utils');
const db = require('../../database');
const Homework = db.models.Homework;
const async = require('async');

function add(req, res, next) {
    const data = req.body;
    const filesArray = req.files;

    Homework.create({
        session_id: data.session_id,
        section_id: data.section_id,
        subject_id: data.subject_id,
        title: data.title,
        description: data.description,
        start_date: utils.getToday(),
        end_date: data.end_date,
        created_by: req.query.employee_id
    }).then((homework) => {
        if (filesArray.length > 0) {
            let fileNames = '';
            async.each(filesArray, function (file, eachcallback) {
                fileNames += file.filename + ',';
                console.log(file);
                eachcallback();
            }, (err) => {
                if (err) {
                    return next(err);
                }
                return Homework.update({ images: fileNames.slice(0, -1) }, { where: { id: homework.id } }).then(() => {
                    return pushNotification.studentPush('Homework', data.title, data.section_id).then(() => {
                        return res.json({
                            status: true,
                            message: 'Homework created successfully'
                        });
                    });
                });
                console.log(fileNames);
                console.log(fileNames.slice(0, -1));
            });
        } else {
            return pushNotification.studentPush('Homework', data.title, data.section_id).then(() => {
                res.json({
                    status: true,
                    message: 'Homework created successfully'
                });
            });
        }
    });
}

module.exports = add;
