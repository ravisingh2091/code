const db = require('../../database');
const Board = db.models.Board;

function add(req, res, next) {
    const boardInfo = {
        name: req.body.name
    };
    Board.findOrCreate({
        defaults: boardInfo,
        where: boardInfo
    }).then((data) => {
        if (data[1]) {
            return res.json({
                status: true,
                message: 'Board created successfully!'
            });
        }
        res.json({
            status: false,
            message: 'Board already exist!'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
