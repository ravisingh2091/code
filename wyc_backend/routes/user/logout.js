const db = require('../../database');
const UserSession = db.models.UserSession;
const ParentDevice = db.models.ParentDevice;
const EmployeeDevice = db.models.EmployeeDevice;

function logout(req, res, next) {
    const sessionId = req.header('authorization');

    const statusCondition = {
        status: 0
    };

    UserSession.update(statusCondition, {
        where: {
            session_id: sessionId
        }
    }).then(() => {
        if (req.body.imei) {
            const deviceWhereCondition = {
                where: {
                    imei: req.body.imei
                }
            };

            if (req.query.type === 'Parent') {
                return ParentDevice.update(statusCondition, deviceWhereCondition).then(() => {
                    res.json({
                        status: true,
                        message: 'Logout successfully'
                    });
                });
            } else {
                return EmployeeDevice.update(statusCondition, deviceWhereCondition).then(() => {
                    res.json({
                        status: true,
                        message: 'Logout successfully'
                    });
                });
            }
        } else {
            res.json({
                status: true,
                message: 'Logout successfully'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = logout;
