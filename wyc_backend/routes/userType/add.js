const db = require('../../database');
const UserType = db.models.UserType;

function list(req, res, next) {
    UserType.create({
        name:'testing'
    }).then(() => {
        res.status(200).json({
            status: true,
            message: 'User type added successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
