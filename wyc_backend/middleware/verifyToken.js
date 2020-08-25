const config = require('../lib/config');
const db = require('../database');
const UserSession = db.models.UserSession;
const User = db.models.User;
const Employee = db.models.Employee;

function verifyToken(req, res, next) {
    const authHeader = req.header('authorization');

    if (!authHeader) {
        return res.status(401).json({ status: 'false', message: 'Missing authorization header' });
    }

    const defaultRoutes = ['/v1/user/login'];
    const currentUrl = req.route.path;

    if (defaultRoutes.indexOf(currentUrl) > -1) {
        if (authHeader !== config.defaultApiKey) {
            return res.status(401).json({ status: 'false', message: 'Unauthorized' });
        }
        next();
    } else {
        UserSession.findOne({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['id', 'user_id', 'type'],
                model: User,
                as: 'user'
            }],
            where: {
                session_id: authHeader,
                '$user.status$': 1
            }
        }).then((user) => {
            if (!user) {
                return res.status(401).json({ status: 'false', message: 'Unauthorized' });
            }
            user = user.get();
            if (user.user.type === 'Parent') {
                req.query.user_id = user.user.id;
                req.query.parent_id = user.user.user_id;
                req.query.type = user.user.type;
                next();
            } else {
                Employee.findById(user.user.user_id).then((employee) => {
                    req.query.user_id = user.user.id;
                    req.query.employee_id = user.user.user_id;
                    req.query.type = user.user.type;
                    req.query.branch_id = employee.branch_id;
                    req.query.role_id = employee.type_id;
                    next();
                });
            }
        });
    }
}

module.exports = verifyToken;
