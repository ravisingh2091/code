const db = require('../../database');
const FuelConsumption = db.models.FuelConsumption;
const Vehicle = db.models.Vehicle;
const Employee = db.models.Employee;

function get(req, res, next) {
    const query = {
        include: [{
            required: true,
            attributes: ['id', 'name', 'reg_no', 'no_of_seat'],
            model: Vehicle,
            as: 'vehicle'
        }, {
            attributes: ['id', 'first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }]
    };

    if (req.query.id) {
        query.where = { id: req.query.id };
    }

    if (req.query.vehicle_id) {
        query.where = { vehicle_id: req.query.vehicle_id };
        query.order = 'date DESC,created_at DESC';
    }

    FuelConsumption.findOne(query).then((result) => {
        res.json({
            status: true,
            message: 'Fuel consumption info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
