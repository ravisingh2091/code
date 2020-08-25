const db = require('../../database');
const BiometricDevice = db.models.BiometricDevice;

function update(req, res, next) {
    const data = req.body;

    BiometricDevice.findOne({
        where: {
            device_id: data.device_id,
            id: {
                $not: data.id
            }
        }
    }).then((deviceInfo) => {
        if (!deviceInfo) {
            return BiometricDevice.update({ device_id: data.device_id }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Biometric device info updated sucessfully'
                });
            });
        }

        return res.json({
            status: false,
            message: 'Biometric device already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
