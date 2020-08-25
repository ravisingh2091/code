const verifyToken = require('../../middleware/verifyToken');
const changePassword = require('./changePassword');
const changeStatus = require('./changeStatus');
const getForgetPassword = require('./getForgetPassword');
const login = require('./login');
const logout = require('./logout');
const updateForgetPassword = require('./updateForgetPassword');
const updateUserNo = require('./updateUserNo');

module.exports = (server) => {
    server.put('/v1/changePassword', verifyToken, changePassword);
    server.put('/v1/changeStatus', verifyToken, changeStatus);
    // get forget password link
    server.post('/v1/get/password', getForgetPassword);
    server.post('/v1/user/login', verifyToken, login);
    server.post('/v1/user/logout', verifyToken, logout);
    // set user forget password
    server.put('/v1/update/password', updateForgetPassword);
    // update user mobile number
    server.put('/v1/update/mobile', verifyToken, updateUserNo);
};
