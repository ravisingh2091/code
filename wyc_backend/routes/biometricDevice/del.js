const db = require('../../database');
const BiometricDevice = db.models.BiometricDevice;

function del(req, res, next) {
    BiometricDevice.destroy({ where: { id: req.query.id } }).then(() => {
        res.json({
            status: true,
            message: 'Biometric device deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
