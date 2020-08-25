'use strict';
const gcm = require('node-gcm');

// KRATITECH
// const sender = new gcm.Sender('AAAABbC2CGk:APA91bFQ7o8A9LD3O0giz9onw085mRP5YLbg7dhpDK6B41lc8I6dayi6qn-IB5Xu0Pn93M7wndJKo9K1pB-BDSNsbN3aQ8echY5cVIH6TRMgDux4pDwaFGkC2wX1NBsd5uONLocJZkgv');

// WYC
const sender = new gcm.Sender('AAAAYqE_5q4:APA91bFg47U4ot59uIZey2cAQROy2NbS6tVgb-teGo-hASIP00fhSx-Hsx7ty2WlHqhXuHJf_9KgA06xhNYYWE2gEWT4-D3MVZGRE1aA_fIzITwH8LOZzEXhA75uxatXAwTpcRoenzzac1Z2NS0AcS2v9hq2t_2PvA');

// WYC Driver 
// const sender = new gcm.Sender('AAAAVLczS0I:APA91bEc3kvPyKHvuxZaWIsREeQK9g3F7PD2IsKNzH3fmTeZORkLY-OVqHmWU5xXHvmpSr_wGNDvb95_Eqm2k4c8qhXimv19j3ATOFx3hhvZ37cG9D7UFVDaAwdI07u6FPziUEOUjsZm0HbFVLktTtCqcAKJQd_2Qw');

const db = require('../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const ParentDevice = db.models.ParentDevice;
const Employee = db.models.Employee;
const EmployeeDevice = db.models.EmployeeDevice;

const PushNotification = {
    /**
     * Send push notifications
     * @param regTokens
     * @param title
     * @param msg
     * @param section_id
     * @param data
     */
    pushMessage: (regTokens, title, msg, section_id = '', data = '') => {
        const msgData = {
            data: {
                title: title,
                message: msg
            }
        };
        if (section_id !== '') {
            msgData.data.section_id = section_id;
        }

        if (data.student_id) {
            msgData.data.student_id = data.student_id;
        }

        if (data.holiday_id) {
            msgData.data.holiday_id = data.holiday_id;
            msgData.data.calendar_id = data.calendar_id;
            msgData.data.operation = data.operation;
        }

        if (data.pushNotify === 'Transport') {
            if (data.route_stop_id) {
                msgData.data.route_stop_id = data.route_stop_id;
            }
            if (data.status) {
                msgData.data.status = data.status;
            }
            if (data.type) {
                msgData.data.type = data.type;
            }
            if (data.last_stop_time) {
                msgData.data.last_stop_time = data.last_stop_time;
            }
            if (data.next_route_stop_id) {
                msgData.data.next_route_stop_id = data.next_route_stop_id;
            }
        }

        const message = new gcm.Message(msgData);
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if (err) {
                console.log(err);
                return true;
            } else {
                console.log(response);
                return true;
            }
        });
    },

    /**
     * Get the student(parents) device tokens
     * @param title
     * @param message
     * @param section_id
     * @returns {*}
     */
    studentPush: (title, message, section_id, session_id = '') => {
        const whereCondition = {
            section_id: section_id
        };

        if (session_id === '') {
            whereCondition.status = 'STUDYING';
        }

        if (session_id !== '') {
            whereCondition.session_id = session_id;
        }
        return StudentSection.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['parent_id'],
                model: Student,
                as: 'student'
            }],
            where: whereCondition,
            group: ['parent_id']
        }).then((parentInfo) => {
            const parentList = [];
            parentInfo.forEach((parentId) => {
                parentId = parentId.get();
                parentList.push(parentId.student.parent_id);
            });

            return ParentDevice.findAll({
                attributes: ['device_token'],
                where: {
                    status: 1,
                    parent_id: {
                        $in: parentList
                    }
                }
            }).then((deviceInfo) => {
                const deviceTokens = [];
                deviceInfo.forEach((deviceInfo) => {
                    deviceInfo = deviceInfo.get();
                    deviceTokens.push(deviceInfo.device_token);
                });
                return PushNotification.pushMessage(deviceTokens, title, message, section_id);
            });
        });
    },

    /**
     * Get employee Device tokens
     * @param title
     * @param message
     * @param branch_id
     * @returns {*}
     */
    employeePush: (title, message, branch_id) => {
        return EmployeeDevice.findAll({
            attributes: ['device_token'],
            include: [{
                attributes: [],
                required: true,
                model: Employee,
                as: 'employee'
            }],
            where: {
                status: 1,
                '$employee.status$': 1,
                '$employee.branch_id$': branch_id
            }
        }).then((deviceInfo) => {
            const deviceTokens = [];
            deviceInfo.forEach((deviceInfo) => {
                deviceInfo = deviceInfo.get();
                deviceTokens.push(deviceInfo.device_token);
            });
            return PushNotification.pushMessage(deviceTokens, title, message);
        });
    },

    /**
     * Get particular student device token
     * @param title
     * @param message
     * @param student_id
     * @returns {*}
     */
    singleStudentPush: (title, message, student_id, type = 'StudentSection') => {
        if (type === 'StudentSection') {
            return StudentSection.findOne({
                include: [{
                    attributes: ['parent_id'],
                    model: Student,
                    as: 'student'
                }],
                where: {
                    id: student_id,
                    status: 'STUDYING'
                }
            }).then((studentInfo) => {
                return ParentDevice.findAll({
                    attributes: ['device_token'],
                    where: {
                        status: 1,
                        parent_id: studentInfo.student.parent_id
                    }
                }).then((deviceInfo) => {
                    const deviceTokens = [];
                    deviceInfo.forEach((deviceInfo) => {
                        deviceInfo = deviceInfo.get();
                        deviceTokens.push(deviceInfo.device_token);
                    });
                    return PushNotification.pushMessage(deviceTokens, title, message, '', { student_id });
                });
            });
        } else {
            return Student.findOne({
                attributes: ['parent_id'],
                where: {
                    id: student_id,
                    status: 1
                }
            }).then((studentInfo) => {
                if (studentInfo) {
                    return ParentDevice.findAll({
                        attributes: ['device_token'],
                        where: {
                            status: 1,
                            parent_id: studentInfo.parent_id
                        }
                    }).then((deviceInfo) => {
                        if (deviceInfo) {
                            const deviceTokens = [];
                            deviceInfo.forEach((deviceInfo) => {
                                deviceInfo = deviceInfo.get();
                                deviceTokens.push(deviceInfo.device_token);
                            });
                            return PushNotification.pushMessage(deviceTokens, title, message, '', { student_id });
                        }
                        return true;
                    });
                }
                return true;
            });
        }
    },

    /**
     * Get single employee device tokens
     * @param title
     * @param message
     * @param employee_id
     * @returns {*}
     */
    singleEmployeePush: (title, message, employee_id) => {
        return EmployeeDevice.findAll({
            attributes: ['device_token'],
            include: [{
                attributes: [],
                required: true,
                model: Employee,
                as: 'employee'
            }],
            where: {
                status: 1,
                employee_id: employee_id,
                '$employee.status$': 1
            }
        }).then((deviceInfo) => {
            const deviceTokens = [];
            deviceInfo.forEach((deviceInfo) => {
                deviceInfo = deviceInfo.get();
                deviceTokens.push(deviceInfo.device_token);
            });
            return PushNotification.pushMessage(deviceTokens, title, message);
        });
    },

    /**
     * @param data
     * @returns {*}
     */
    empTransportStatusAlert: (data) => {
        const whereCondition = {
            status: '1',
            '$employee.status$': '1',
            '$employee.branch_id$': data.branch_id,
            '$employee.mode_of_transport$': 'Bus',
            '$employee.route_vehicle_id$': data.route_vehicle_id,
            '$employee.slot$': {
                $in: data.slot.split(',')
            }
        };

        if (data.type === 'Pick') {
            whereCondition['$employee.transport_type$'] = {
                $in: ['Both', 'Oneway-Pick']
            };
        } else {
            whereCondition['$employee.transport_type$'] = {
                $in: ['Both', 'Oneway-Drop']
            };
        }

        return EmployeeDevice.findAll({
            attributes: ['device_token'],
            include: [{
                attributes: [],
                required: true,
                model: Employee,
                as: 'employee'
            }],
            where: whereCondition
        }).then((deviceInfo) => {
            const deviceTokens = [];
            deviceInfo.forEach((deviceInfo) => {
                deviceInfo = deviceInfo.get();
                deviceTokens.push(deviceInfo.device_token);
            });

            return PushNotification.pushMessage(deviceTokens, 'Transport', '', '', data);
        });
    },

    /**
     * Get transport students device tokens
     * @param route_vehicle_id
     * @param slot
     * @param type
     * @param msg
     * @returns {*}
     */
    stuTransportStatusAlert: (data) => {
        const whereCondition = {
            status: '1',
            mode_of_transport: 'Bus',
            route_vehicle_id: data.route_vehicle_id
        };

        if (data.slot) {
            whereCondition.slot = {
                $in: data.slot.split(',')
            };
        }

        if (data.type === 'Pick') {
            whereCondition.transport_type = {
                $in: ['Both', 'Oneway-Pick']
            };
        } else {
            whereCondition.transport_type = {
                $in: ['Both', 'Oneway-Drop']
            };
        }

        return Student.findAll({
            attributes: ['id', 'parent_id'],
            where: whereCondition
        }).then((studentInfo) => {
            if (studentInfo.length > 0) {
                const parentIds = [];
                studentInfo.forEach(element => {
                    parentIds.push(element.parent_id);
                });

                return ParentDevice.findAll({
                    attributes: ['device_token'],
                    where: {
                        status: 1,
                        parent_id: {
                            $in: parentIds
                        }
                    }
                }).then((deviceInfo) => {
                    const deviceTokens = [];
                    deviceInfo.forEach((deviceInfo) => {
                        deviceInfo = deviceInfo.get();
                        deviceTokens.push(deviceInfo.device_token);
                    });
                    return PushNotification.pushMessage(deviceTokens, 'Transport', data.message, '', data);
                });
            } else {
                return true;
            }
        });
    },
    getParentDeviceTokens: (parentIds) => {
        return ParentDevice.findAll({
            attributes: ['device_token'],
            where: {
                status: 1,
                parent_id: {
                    $in: parentIds
                }
            }
        }).then((deviceInfo) => {
            return deviceInfo.map((row) => { return row.device_token; });
        });
    },
    transportPush: (studentList, title, content) => {
        const parentIds = studentList.map((row) => { return row.parent.id; });
        return PushNotification.getParentDeviceTokens(parentIds).then((deviceTokens) => {
            return PushNotification.pushMessage(deviceTokens, title, content);
        });
    },

    singleParentPush: (parent_id) => {
        return ParentDevice.findAll({
            attributes: ['device_token'],
            where: {
                parent_id,
                status: 1
            }
        }).then((data) => {
            if (data) {
                const deviceTokens = data.map((row) => row.device_token);
                return PushNotification.pushMessage(deviceTokens, 'LOGOUT', '');
            } else {
                return true;
            }
        });
    }
};

module.exports = PushNotification;
