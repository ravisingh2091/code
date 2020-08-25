const db = require('../../database');
const Route = db.models.Route;

function add(req, res, next) {
    const data = req.body;

    return Route.findOrCreate({
        defaults: {
            branch_id: req.query.branch_id,
            name: data.name,
            description: data.description
        },
        where: {
            branch_id: req.query.branch_id,
            name: data.name
        }
    }).then((routeInfo) => {
        if (routeInfo[1]) {
            res.json({
                status: true,
                message: 'Route added successfully'
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
