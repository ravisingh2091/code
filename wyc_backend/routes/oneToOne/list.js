const db = require('../../database');
const OneToOne = db.models.OneToOne;

function list(req, res, next) {
    OneToOne.findAll({
        where: {
            recipient: req.query.id,
            recipient_type: req.query.recipient_type
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'One to one massage listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
