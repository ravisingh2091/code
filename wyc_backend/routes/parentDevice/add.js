const db = require('../../database');
const ParentDevice = db.models.ParentDevice;

function add(req, res, next) {
    const parent_id = req.query.parent_id;
    const data = req.body;

    ParentDevice.findOne({
        where: {
            parent_id: parent_id,
            imei: data.imei
        }
    }).then((device) => {
        if (!device) {
            return ParentDevice.create({
                parent_id: parent_id,
                device_token: data.device_token,
                imei: data.imei
            }).then(() => {
                res.json({
                    status: true,
                    message: 'Device info added successfully'
                });
            });
        }
        ParentDevice.update({
            device_token: data.device_token,
            status: 1
        }, { where: { id: device.id } }).then(() => {
            res.json({
                status: true,
                message: 'Device info updated successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
