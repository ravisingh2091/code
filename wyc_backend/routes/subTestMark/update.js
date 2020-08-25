const async = require('async');
const db = require('../../database');
const SubTestMark = db.models.SubTestMark;

function update(req, res, next) {
    async.eachSeries(req.body, (element, callback) => {
        SubTestMark.update(
            {
                mark: element.mark,
                status: element.status
            }, {
                where: {
                    id: element.id
                }
            }).then(() => callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Student sub test mark updated successfully'
        });
    });
}

module.exports = update;
