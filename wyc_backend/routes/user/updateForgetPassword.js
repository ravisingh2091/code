const utils = require('../../lib/utils');
const db = require('../../database');
const User = db.models.User;
const UserSession = db.models.UserSession;

function updateForgetPassword(req, res, next) {
    UserSession.findOne({
        where: {
            session_id: req.body.token,
            status: 1
        }
    }).then((userSession) => {
        if (userSession) {
            return User.update({ password: utils.md5Password(req.body.password) }, { where: { id: userSession.user_id } }).then(() => {
                return UserSession.update({ status: 0 }, { where: { user_id: userSession.user_id } }).then(() => {
                    return res.json({
                        status: true,
                        message: 'password reset successfully'
                    });
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'your link expired'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateForgetPassword;
