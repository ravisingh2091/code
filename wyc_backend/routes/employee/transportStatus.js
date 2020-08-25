const utils = require('../../lib/utils');
const db = require('../../database');
const Employee = db.models.Employee;

function transportStatus(req, res, next) {
    const data = req.body;
    const updateData = {};
    let msg = '';

    Employee.findOne({
        attributes: ['id', 'mode_of_transport', 'route_stop_id', 'route_vehicle_id', 'slot', 'transport_type'],
        where: { id: data.id }
    }).then((studentInfo) => {
        if (data.mode_of_transport === 'Bus') {
            if (studentInfo.mode_of_transport === 'Bus' && studentInfo.trans_enable_date !== null) {
                updateData.route_stop_id = data.route_stop_id ? data.route_stop_id : studentInfo.route_stop_id;
                updateData.route_vehicle_id = data.route_vehicle_id ? data.route_vehicle_id : studentInfo.route_vehicle_id;
                updateData.slot = data.slot ? data.slot : studentInfo.slot;
                updateData.transport_type = data.transport_type ? data.transport_type : studentInfo.transport_type;
                updateData.trans_enable_date = utils.formatDate(data.trans_enable_date);
                msg = 'Employee transport info updated successfully';
            } else {
                updateData.mode_of_transport = data.mode_of_transport;
                updateData.route_stop_id = data.route_stop_id ? data.route_stop_id : studentInfo.route_stop_id;
                updateData.route_vehicle_id = data.route_vehicle_id ? data.route_vehicle_id : studentInfo.route_vehicle_id;
                updateData.slot = data.slot ? data.slot : studentInfo.slot;
                updateData.transport_type = data.transport_type ? data.transport_type : studentInfo.transport_type;
                updateData.trans_enable_date = utils.formatDate(data.trans_enable_date);
                msg = 'Employee transport enabled successfully';
            }
        } else {
            updateData['mode_of_transport'] = 'Self';
            updateData['route_stop_id'] = null;
            updateData['route_vehicle_id'] = null;
            updateData['slot'] = null;
            updateData['transport_type'] = null;
            msg = 'Employee transport disabled successfully';
        }

        return Employee.update(updateData, { where: { id: data.id } }).then(() => {
            res.json({
                status: true,
                message: msg
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transportStatus;
