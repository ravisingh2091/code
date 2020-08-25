const db = require('../../database');
const ExtraExpenditurePayment = db.models.ExtraExpenditurePayment;
const ExtraExpenditureBoucherPayment= db.models.ExtraExpenditureBoucherPayment;

function add(req, res, next) {

    var date= new Date().toISOString()
    var dateNew=date.split('T')[0].replace(/-/g, '')
    console.log(date)
    console.log(dateNew)
    //req.body.session_id=req.query.session_id
    req.body.branch_id=req.query.branch_id
    ExtraExpenditureBoucherPayment.create(req.body).then((result) => {
        if (result) {
               console.log(result.id)
            let boucher_id=dateNew+result.id
            let paymentData=req.body.paymentData.map(it=>{
                it.payment_boucher_id=result.id	
                it.branch_id=req.query.branch_id
                return it
            })
            console.log(boucher_id)
            ExtraExpenditureBoucherPayment.update({ boucher_id: boucher_id}, { where: { id: result.id } }).then(data=>{
                console.log(data)
            },error=>{
                console.log(error)
            })
            return ExtraExpenditurePayment.bulkCreate(paymentData, {returning: true}).then(() => {
                res.json({
                    status: true,
                    message: 'Payment Added successfully'
                });
            }).catch((err) => {
                next(err);
            });;
        }else{
            res.json({
                status: false,
                message: 'Unable to add payment'
            });
        }
       
    }).catch((err) => {
        next(err);
    });
}
// function add(req, res, next) {

//     let dataValue={

//     }

//     // if(req.body.session_id){
//     //     dataValue.session_id =req.body.session_id 
//     // }

//     // if(req.body.head_id){
//     //     dataValue.head_id =req.body.head_id 
//     // }

//     // if(req.body.sub_head_id){
//     //     dataValue.sub_head_id =req.body.sub_head_id 
//     // }

//     // if(req.body.name){
//     //     dataValue.name =req.body.name 
//     // }
//     // if(req.body.description){
//     //     dataValue.description =req.body.description 
//     // }

//     // if(req.body.amount){
//     //     dataValue.amount =req.body.amount 
//     // }

//     // if(req.body.status){
//     //     dataValue.status =req.body.status 
//     // }

//     // if(req.body.status){
//     //     dataValue.status =req.body.status 
//     // }

//     // if(req.body.edited_Count){
//     //     dataValue.edited_Count =req.body.edited_Count 
//     // }

//     // if(req.body.given_by){
//     //     dataValue.given_by =req.body.given_by 
//     // }

//     // if(req.body.updated_details){
//     //     dataValue.updated_details =req.body.updated_details 
//     // }

//     ExtraExpenditurePayment.bulkCreate(req.body.paymentData, {returning: true}).then((result) => {
//         if (result) {
//             res.json({
//                 status: true,
//                 message: 'Payment added successfully',
//                 result:result
//             });
//         } else {
//             res.json({
//                 status: false,
//                 message: 'Payment not added.'
//             });
//         }
//     }).catch((err) => {
//         console.log(err)
//         next(err);
//     });
// }

module.exports = add;
