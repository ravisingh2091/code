const pushNotification = require('../../common/pushNotification');
const utils = require('../../lib/utils');
const db = require('../../database');
const Student = db.models.Student;

function transportStatus(req, res, next) {
    const data = req.body;
    const updateData = {};
    let msg = '';
    let title = 'Transport ';

    Student.findOne({
        attributes: ['id', 'mode_of_transport', 'trans_enable_date', 'route_stop_id', 'route_vehicle_id', 'slot', 'transport_type'],
        where: { id: data.id }
    }).then((studentInfo) => {
        if (data.mode_of_transport === 'Bus') {
            if (studentInfo.mode_of_transport === 'Bus' && studentInfo.trans_enable_date !== null) {
                updateData.route_stop_id = data.route_stop_id ? data.route_stop_id : studentInfo.route_stop_id;
                updateData.route_vehicle_id = data.route_vehicle_id ? data.route_vehicle_id : studentInfo.route_vehicle_id;
                updateData.slot = data.slot ? data.slot : studentInfo.slot;
                updateData.transport_type = data.transport_type ? data.transport_type : studentInfo.transport_type;
                updateData.trans_enable_date = utils.formatDate(data.trans_enable_date);
                msg = 'Student transport info updated successfully';
                title += 'Update';
            } else {
                updateData.mode_of_transport = data.mode_of_transport;
                updateData.route_stop_id = data.route_stop_id ? data.route_stop_id : studentInfo.route_stop_id;
                updateData.route_vehicle_id = data.route_vehicle_id ? data.route_vehicle_id : studentInfo.route_vehicle_id;
                updateData.slot = data.slot ? data.slot : studentInfo.slot;
                updateData.transport_type = data.transport_type ? data.transport_type : studentInfo.transport_type;
                updateData.trans_enable_date = utils.formatDate(data.trans_enable_date);
                msg = 'Student transport enabled successfully';
                title += 'Enable';
            }
        } else {
            updateData['mode_of_transport'] = 'Self';
            updateData['route_stop_id'] = null;
            updateData['route_vehicle_id'] = null;
            updateData['slot'] = null;
            updateData['transport_type'] = null;
            msg = 'Student transport disabled successfully';
            title += 'Disable';
        }

        return Student.update(updateData, { where: { id: data.id } }).then(() => {
            pushNotification.singleStudentPush(title, msg, data.id, 'Student');
            return res.json({
                status: true,
                message: msg
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transportStatus;
