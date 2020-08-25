const async = require('async');
const db = require('../../database');
const Grade = db.models.Grade;

function update(req, res, next) {
    async.eachSeries(req.body, (element, callback) => {
        console.log(element)

        Grade.update(
            {    

                from_mark: element.from_mark,
                to_mark: element.to_mark,
                grade: element.grade
            }, {
                where: { id: element.id }
            
            }).then(() => { return callback(); });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Grades updated successfully'
        });
    });
}

module.exports = update;
