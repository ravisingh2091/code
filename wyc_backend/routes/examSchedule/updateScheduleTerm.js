const utils = require('../../lib/utils');
const db = require('../../database');
const ScheduleTerm = db.models.ScheduleTerm;

function updateScheduleTerm(req, res, next) {
    const data = req.body;

    if (!data.id) {
        return res.json({
            status: false,
            message: 'Id is required'
        });
    }

    ScheduleTerm.update({ publish_date: data.publish_date }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Schdule term info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateScheduleTerm;
