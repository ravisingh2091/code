const commonTransport = require('../../common/transport');
const commonMessage = require('../../common/message');
const pushNotification = require('../../common/pushNotification');
const db = require('../../database');
const TransportComm = db.models.TransportComm;

function add(req, res, next) {
    const data = req.body;
    
    const createData = {
        session_id: data.session_id,
        title: data.title,
        content: data.content,
        msg_type: data.msg_type,
        msg_to: data.msg_to
    };
    const createBulk = [];

    if (data.msg_to === 'Stop') {
        createData.stop_id = data.stop_id;
    }

    if (data.msg_to === 'RouteVehicle') {
        data.route_vehicle_id.forEach(element => {
            createBulk.push({
                session_id: data.session_id,
                title: data.title,
                content: data.content,
                route_vehicle_id: element,
                msg_type: data.msg_type,
                msg_to: data.msg_to
            });
        });
    }

    commonTransport.transportStudent(data).then((studentList) => {
        if (studentList.length > 0) {
            if (data.msg_to === 'RouteVehicle') {
                return TransportComm.bulkCreate(createBulk).then(() => {
                    if (data.msg_type === 'Message') {
                        return commonMessage.transportMsg(req.query.branch_id, studentList, data.content).then(() => {
                            return res.json({
                                status: true,
                                message: 'Message sent successfully'
                            });
                        });
                    } else {
                        return pushNotification.transportPush(studentList, data.title, data.content).then(() => {
                            return res.json({
                                status: true,
                                message: 'Push notification sent successfully'
                            });
                        });
                    }
                });
            } else {
                return TransportComm.create(createData).then(() => {
                    if (data.msg_type === 'Message') {
                        return commonMessage.transportMsg(req.query.branch_id, studentList, data.content).then(() => {
                            return res.json({
                                status: true,
                                message: 'Message sent successfully'
                            });
                        });
                    } else {
                        return pushNotification.transportPush(studentList, data.title, data.content).then(() => {
                            return res.json({
                                status: true,
                                message: 'Push notification sent successfully'
                            });
                        });
                    }
                });
            }
        }
        res.json({
            status: false,
            message: 'No Student'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
