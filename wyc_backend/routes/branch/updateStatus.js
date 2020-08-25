const db = require('../../database');
const connection = db.connection;
const Branch = db.models.Branch;

function updateStatus(req, res, next) {
    const data = req.body;

    const userStatus = data.status === 'Active' ? 1 : 2;
    const userWhereStatus = data.status === 'Active' ? 2 : 1;

    const userQuery = `UPDATE user AS A INNER JOIN employee AS B ON A.user_id = B.id SET A.status = ${userStatus} WHERE A.type='Employee' AND B.branch_id=${data.branch_id} AND A.status=${userWhereStatus};`;
    // const sessionQuery = `UPDATE user_session AS A INNER JOIN user AS B ON A.user_id = B.id INNER JOIN employee AS C ON (B.user_id = C.id) SET A.status = ${sessionStatus} WHERE B.type='Employee' AND C.branch_id=${data.branch_id} AND A.status=1;`;

    Promise.all([
        Branch.update({ status: data.status }, { where: { id: data.branch_id } }),
        connection.query(userQuery),
    ]).then(() => {
        // if (data.status === 'Deactive') {
        // return connection.query(sessionQuery).then(() => {
        res.json({
            status: true,
            message: `Branch ${data.status} successfully`
        });
        // });
        // }
        // return res.json({
        //     status: true,
        //     message: `Branch activated successfully`
        // });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateStatus;
