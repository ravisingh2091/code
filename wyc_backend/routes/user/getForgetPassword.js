const utils = require('../../lib/utils');
const config = require('../../lib/config');
const message = require('../../common/message');
const db = require('../../database');
const User = db.models.User;
const UserSession = db.models.UserSession;

function getForgetPassword(req, res, next) {
    User.findOne({
        where: {
            user_no: req.body.user_no,
            type: req.body.type,
            status: 1
        }
    }).then((userInfo) => {
        if (userInfo) {
            const dateNow = new Date();
            const session_id = utils.md5Password(userInfo.id + dateNow.getTime() + '' + userInfo.id).substr(1, 46);
            const url = `${config.webBaseUrl}user/update/${session_id}`;

            const content = 'Click the link to set new password:- ' + url;
            return UserSession.findOne({
                where: {
                    user_id: userInfo.id
                }
            }).then((sessionInfo) => {
                if (sessionInfo) {
                    return UserSession.update({ session_id, status: 1 }, { where: { user_id: userInfo.id } }).then(() => {
                        message.resetPassword(req.body.user_no, content, userInfo.user_id, req.body.type);
                        res.json({
                            status: true,
                            message: 'we will send reset password link into registered mobile number'
                        });
                    });
                } else {
                    return UserSession.create({
                        user_id: userInfo.id,
                        session_id: session_id
                    }).then(() => {
                        message.resetPassword(req.body.user_no, content, userInfo.user_id, req.body.type);
                        res.json({
                            status: true,
                            message: 'we will send reset password link into registered mobile number'
                        });
                    });
                }
            });
        } else {
            res.json({
                status: false,
                message: 'Invalid mobile number'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = getForgetPassword;
