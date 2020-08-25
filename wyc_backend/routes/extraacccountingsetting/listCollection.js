const db = require('../../database');
const ExtraCollectionHead = db.models.ExtraCollectionHead;

function list(req, res, next) {
    ExtraCollectionHead.findAll({
         where:{
            branch_id:req.query.branch_id
         }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Collection Head listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
