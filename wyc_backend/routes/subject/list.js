const db = require('../../database');
const Subject = db.models.Subject;

function list(req, res, next) {
    Subject.findAll({
        where: {
            branch_id: req.query.branch_id
        },
        order:'name'
    }).then((result) => {
        res.status(200).json({
            status: true,
            message: 'school subject listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
