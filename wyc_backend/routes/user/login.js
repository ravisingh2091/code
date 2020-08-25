const utils = require('../../lib/utils');
const db = require('../../database');
const User = db.models.User;
const UserSession = db.models.UserSession;

function loginByMail(data, callback) {
    User.findOne({
        where: {
            user_no: data.userName,
            password: utils.md5Password(data.password),
            type: data.type
        }
    }).then((user) => {
        return callback(user);
    });
}

function login(req, res, next) {
    const data = req.body;

    loginByMail(data, (user) => {
        if (!user) {
            return res.json({ status: false, message: 'Email / Phone Number or Password Incorrect' });
        }

        if (user.status === 0) {
            return res.json({ status: false, message: 'Your account deactivated' });
        }

        if (user.status === 2) {
            return res.json({ status: false, message: 'Your school deactivated' });
        }
        
        user = user.get();
        const dateNow = new Date();
        const session_id = dateNow.getTime() + '' + user.id;

        UserSession.findOne({
            where: {
                user_id: user.id
            }
        }).then((userSession) => {
            if (!userSession) {
                return UserSession.create({
                    user_id: user.id,
                    session_id: session_id
                }).then(() => {
                    res.json({
                        status: true,
                        message: 'Login SuccessFully',
                        user: {
                            id: user.id,
                            userName: user.user_no,
                            userId: user.user_id,
                            type: user.type,
                            sessionId: session_id
                        }
                    });
                });
            } else {
                const sessionId = userSession.get().status ? userSession.get().session_id : session_id;
                return UserSession.update({ session_id: sessionId, status: 1 }, {
                    where: { user_id: user.id }
                }).
                    then(() => {
                        res.json(200,
                            {
                                status: true,
                                message: 'Login SuccessFully',
                                user: {
                                    id: user.id,
                                    userName: user.user_no,
                                    userId: user.user_id,
                                    type: user.type,
                                    sessionId: sessionId
                                }
                            });
                    });
            }
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = login;
