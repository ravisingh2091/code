const db = require('../../database');
const FeeCarryForward = db.models.FeeCarryForward;
function get(req, res, next) {
   FeeCarryForward.findById(req.query.id).then((result) => {
       res.json({
           status: true,
           message: 'Test info get successfully',
           data: result
       });
   }).catch((err) => {
       next(err);
   });
}
module.exports = get;