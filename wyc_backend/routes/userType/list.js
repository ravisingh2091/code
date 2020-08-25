const db = require('../../database');
const UserType = db.models.UserType;

function list(req, res, next) {
    UserType.findAll().then((result) => {
        res.status(200).json({
            status: true,
            message: 'User type listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
