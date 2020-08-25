const db = require('../../database');
const Board = db.models.Board;

function update(req, res, next) {
    Board.find({
        where: {
            name: req.body.name,
            $not: {
                id: req.body.id
            }
        }
    }).then((data) => {
        if (!data) {
            return Board.update({
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Board updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Board already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
