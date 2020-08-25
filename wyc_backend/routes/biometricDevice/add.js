const db = require('../../database');
const BiometricDevice = db.models.BiometricDevice;

function add(req, res, next) {
    const data = req.body;
    BiometricDevice.findOrCreate({
        defaults: {
            branch_id: data.branch_id,
            device_id: data.device_id
        },
        where: { device_id: data.device_id }
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Biometric device added successfully'
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

module.exports = add;
