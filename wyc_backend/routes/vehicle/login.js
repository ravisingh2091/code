const db = require('../../database');
const Vehicle = db.models.Vehicle;
const Branch = db.models.Branch;
const School = db.models.School;

function login(req, res, next) {
    Vehicle.findOne({
        include: [{
            required: true,
            attributes: ['id', 'branch', 'principal_name', 'email', 'secondary_email', 'primary_no', 'secondary_no', 'affiliation_no', 'logo', 'season', 'website', 'latitude', 'longitude'],
            model: Branch,
            as: 'branch',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: School,
                as: 'school',
            }]
        }],
        where: {
            reg_no: req.body.userName,
            password: req.body.password
        }
    }).then((data) => {
        if (data) {
            res.json({
                status: true,
                message: 'Login successfully',
                data
            });
        } else {
            res.json({
                status: false,
                message: 'Reg No or Password Incorrect'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = login;
