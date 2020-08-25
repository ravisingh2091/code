const utils = require('../../lib/utils');
const db = require('../../database');
const User = db.models.User;

function changePassword(req, res, next) {
    const data = req.body;
    User.findOne({
        where: {
            id: req.query.user_id,
            password: utils.md5Password(data.currentPassword)
        }
    }).then((user) => {
        if (!user) {
            return res.json({
                status: false,
                message: 'Current password incorrect'
            });
        }
        return User.update({
            password: utils.md5Password(data.newPassword)
        }, { where: { id: req.query.user_id } }).then(() => {
            res.json({
                status: true,
                message: 'password update successfully'
            });
        }).catch((err) => {
            next(err);
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = changePassword;
