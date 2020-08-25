const db = require('../../database');
const Stream = db.models.Stream;

function add(req, res, next) {
    const streamInfo = {
        branch_id: req.query.branch_id,
        name: req.body.name
    };

    Stream.findOrCreate({
        defaults: streamInfo,
        where: streamInfo
    }).then((data) => {
        if (data[1]) {
            return res.json({
                status: true,
                message: 'Stream added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Stream Already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
