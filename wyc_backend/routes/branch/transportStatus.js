const utils = require('../../lib/utils');
const db = require('../../database');
const Branch = db.models.Branch;

function transportStatus(req, res, next) {
    const data = req.body;

    const condition = {
        transport_status: data.status
    };
    if (data.status === '1') {
        condition.transport_enable_date = utils.formatDate(data.transport_enable_date);
    }

    Branch.update(condition, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: data.status === '1' ? 'Transport enable info updated' : 'Transport disabled'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transportStatus;
