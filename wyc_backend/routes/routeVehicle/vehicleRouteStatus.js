const pushNotification = require('../../common/pushNotification');
const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;

function vehicleStartStop(req, res, next) {
    const data = req.body;

    const updateData = {};

    if (data.latitude && data.longitude) {
        updateData.latitude = data.latitude;
        updateData.longitude = data.longitude;
    }

    if (data.status) {
        updateData.status = data.status;
    }

    if (data.start_time) {
        updateData.slot = data.slot;
        updateData.start_time = data.start_time;
        updateData.bus_way = data.type;
    }

    // if (data.status === 'Start' || data.status === 'Stop') {
    //     updateData.status = data.status;
    //     updateData.slot = data.slot;
    //     updateData.start_time = data.start_time;
    // }

    // if (data.type === 'Pick' || data.type === 'Drop') {
    //     updateData.bus_way = data.type;
    // }

    if (data.route_stop_id) {
        updateData.last_stop_id = data.route_stop_id;
        updateData.last_stop_time = data.last_stop_time;
    }

    RouteVehicle.update(updateData, { where: { id: data.route_vehicle_id } }).then(() => {
        if (data.status) {
            data.pushNotify = 'Transport';
            if (data.status === 'Start') {
                if (data.type === 'Pick') {
                    return Promise.all([
                        pushNotification.stuTransportStatusAlert(data),
                        pushNotification.empTransportStatusAlert(data)
                    ]).then(() => {
                        // bus started for pick ur kids & Guruji's
                        res.json({
                            status: true,
                            message: 'Bus started for pick child'
                        });
                    });
                } else {
                    return pushNotification.stuTransportStatusAlert(data).then(() => {
                        // bus started for drop ur kids
                        res.json({
                            status: true,
                            message: 'Bus started for drop child'
                        });
                    });
                }
            } else if (data.status === 'Stop') {
                if (data.type === 'Pick') {
                    return pushNotification.stuTransportStatusAlert(data).then(() => {
                        // reached school successfully
                        res.json({
                            status: true,
                            message: 'Bus reached school'
                        });
                    });
                } else {
                    res.json({
                        status: true,
                        message: 'Bus reached last stop'
                    });
                }
            } else {
                return pushNotification.stuTransportStatusAlert(data).then(() => {
                    res.json({
                        status: true,
                        message: 'Bus on the way'
                    });
                });
            }
        } else {
            res.json({
                status: true,
                message: 'Route Vehicle data updated successfully'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = vehicleStartStop;
