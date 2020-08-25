const db = require('../../database');
const User = db.models.User;

function changeStatus(req, res, next) {
    const data = req.body;

    let message = '';

    if (data.status) {
        message = 'Account activated';
    } else {
        message = 'Account deactivated';
    }

    User.update({ status: data.status }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: message
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = changeStatus;
