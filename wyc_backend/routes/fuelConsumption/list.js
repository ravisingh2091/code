const db = require('../../database');
const FuelConsumption = db.models.FuelConsumption;
const Vehicle = db.models.Vehicle;
const Employee = db.models.Employee;

function get(req, res, next) {
    FuelConsumption.findAll({
        include: [{
            required: true,
            attributes: ['id', 'name', 'reg_no'],
            model: Vehicle,
            as: 'vehicle'
        }, {
            attributes: ['id', 'first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }],
        where: { session_id: req.query.session_id },
        order: 'date DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Fuel Consumption info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
