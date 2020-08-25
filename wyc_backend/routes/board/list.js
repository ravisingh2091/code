const db = require('../../database');
const Board = db.models.Board;

function list(req, res, next) {
    Board.findAll({}).then((result) => {
        res.json(200, {
            status: true,
            message: 'Board listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
