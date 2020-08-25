const db = require('../../database');
const FeeCarryForward = db.models.FeeCarryForward;
function update(req, res, next) {
   const data = req.body;
   FeeCarryForward.findOne({
       where: {
           id: req.query.id,
           amount: data.amount,
           id: {
               $ne: data.id
           }
       }
   }).then((result) => {
           return FeeCarryForward.update({ amount: data.amount }, { where: { id: data.id } }).then(() => {
               res.json({
                   status: true,
                   message: 'FeeCarryForward amount updated successfully'
               });
           });
   }).catch((err) => {
       next(err);
   });
}
module.exports = update;
