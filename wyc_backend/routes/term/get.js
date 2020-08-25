const db = require('../../database');
const Term = db.models.Term;

function get(req, res, next) {
    Term.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Term info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
