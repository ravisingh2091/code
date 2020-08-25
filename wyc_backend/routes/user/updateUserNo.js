const db = require('../../database'),
    Parent = db.models.Parent,
    Employee = db.models.Employee,
    User = db.models.User,
    connection = db.connection;


function updateUserNo(req, res, next) {
    const data = req.body;
    User.findOne({
        where: {
            user_no: data.mobile_no,
            type: data.type,
            $not: {
                user_id: data.id
            }
        }
    }).then((user) => {
        if (!user) {
            return User.update({ user_no: data.mobile_no }, { where: { user_id: data.id, type: data.type } }).then(() => {
                const userQuery = `UPDATE user_session AS A INNER JOIN user AS B ON A.user_id = B.id SET A.status = 0 WHERE B.type='${data.type}' AND B.user_id=${data.id}`;

                if (data.type === 'Parent') {
                    return Promise.all([
                        Parent.update({ contact_no: data.mobile_no }, { where: { id: data.id } }),
                        connection.query(userQuery)
                    ]).then(() => {
                        res.json({
                            status: true,
                            message: 'Mobile no updated successfully'
                        });
                    });
                }

                return Promise.all([
                    Employee.update({ contact_no: data.mobile_no }, { where: { id: data.id } }),
                    connection.query(userQuery)
                ]).then(() => {
                    res.json({
                        status: true,
                        message: 'Mobile no updated successfully'
                    });
                });
            });
        }
        return res.json({
            status: false,
            message: 'Mobile number already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateUserNo;
