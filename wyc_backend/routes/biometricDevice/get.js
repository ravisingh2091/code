const db = require('../../database');
const BiometricDevice = db.models.BiometricDevice;
const Branch = db.models.Branch;
const School = db.models.School;

function get(req, res, next) {
    BiometricDevice.findOne({
        attributes: ['id', 'device_id'],
        include: [{
            required: true,
            attributes: ['id', 'branch'],
            model: Branch,
            as: 'branch',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: School,
                as: 'school'
            }],
        }],
        where: { id: req.query.id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Biometric device listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
