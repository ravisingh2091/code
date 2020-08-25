const db = require('../../database');
const ExtraCollectionPayment = db.models.ExtraCollectionPayment;
const ExtraCollectionHead = db.models.ExtraCollectionHead;
//const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
ExtraCollectionPayment.belongsTo(ExtraCollectionHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
//ExtraCollectionPayment.belongsTo(ExtraExpenditureSubHead, {foreignKey: 'sub_head_id', targetKey: 'id', as:'subHead'});
const ExtraCollectionBoucherPayment= db.models.ExtraCollectionBoucherPayment;
ExtraCollectionBoucherPayment.hasMany(ExtraCollectionPayment, {foreignKey: 'payment_boucher_id', as:'payment'});
ExtraCollectionPayment.belongsTo(ExtraCollectionBoucherPayment, {foreignKey: 'payment_boucher_id', as:'boucher'});
function list(req, res, next) {
   console.log(req.body)
   let headReq=[]
   let subHeadReq=[]
   let dateReq=[]
   let  consolidate=[]

   if(req.body.head_id){
    headReq.push({id:req.body.head_id})
    consolidate.push({head_id:req.body.head_id})
   }
   if(req.body.sub_head_id){
    subHeadReq.push({id:req.body.sub_head_id})
   }


    //   ExtraCollectionBoucherPayment.findAll({
    //     include: [
    //           {
        ExtraCollectionPayment.findAll({
            where:consolidate,
                include: [
                    {
                    model: ExtraCollectionHead,
                    as:'head',
                    //attributes:['name', 'id'],
                  },
                  {
                    model: ExtraCollectionBoucherPayment,
                    as:'boucher'
                  },
                  // {
                  //   model: ExtraExpenditureSubHead,
                  //   as:'subHead',
                  //   attributes:['name', 'id'],
                  //   where:subHeadReq
                  // }
                ],
        //       },
           
        // ]
       
        // where:conditions
    }).then((result) => {
        res.json({
            status: true,
            message: 'Extra  collection Payment listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
   
//    ExtraCollectionBoucherPayment.findAll({
//         include: [
//               {
//                 model: ExtraCollectionPayment,
//                 as:'payment',
//                 include: [
//                     {
//                     model: ExtraCollectionHead,
//                     as:'head',
//                     attributes:['name', 'id'],
//                     where:headReq
//                   },
//                   // {
//                   //   model: ExtraExpenditureSubHead,
//                   //   as:'subHead',
//                   //   attributes:['name', 'id'],
//                   //   where:subHeadReq
//                   // }
//                 ],
//               },
           
//         ]
       
//         // where:conditions
//     }).then((result) => {
//         res.json({
//             status: true,
//             message: 'Extra Expenditure Payment listed successfully',
//             data: result
//         });
//     }).catch((err) => {
//         next(err);
//     });
}

module.exports = list;
