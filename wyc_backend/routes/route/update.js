const db = require('../../database');
const Route = db.models.Route;

function add(req, res, next) {
    const data = req.body;

    return Route.findOne({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((routeInfo) => {
        if (!routeInfo) {
            return Route.update({
                branch_id: req.query.branch_id,
                name: data.name,
                description: data.description
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Route updated successfully'
                });
            });
        } else {
            res.json({
                status: false,
                message: 'Route name already exists'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
