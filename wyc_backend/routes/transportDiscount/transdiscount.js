const commonFee = require('../../common/fee');
const db = require('../../database');
const FeePayment = db.models.FeePayment;
const StudentSection = db.models.StudentSection;
const Class = db.models.Class;
const Section = db.models.Section;
const Student = db.models.Student;
const Parent = db.models.Parent;
const TransDiscount = db.models.TransDiscount;
const TransportDiscount = db.models.TransportDiscount;

function transdiscount(req, res, next) {
    const session_id = req.query.session_id;

    const studentCondition = { session_id };
    const paymentCondition = { '$studentSection.session_id$': session_id };

    if (req.query.stu_sec_id) {
        studentCondition['id'] = req.query.stu_sec_id;
        paymentCondition['student_section_id'] = req.query.stu_sec_id;
    }

    if (req.query.section_id) {
        studentCondition['section_id'] = req.query.section_id;
        paymentCondition['$studentSection.section_id$'] = req.query.section_id;
    }

    // if (req.query.amount) {
    //     if (req.query.amount === '0') {
    //         studentCondition['$student.payable_amount$'] = {
    //             $eq: req.query.amount
    //         };
    //         paymentCondition['$studentSection.student.payable_amount$'] = {
    //             $eq: req.query.amount
    //         };
    //     } else {
    //         studentCondition['$student.payable_amount$'] = {
    //             $gte: req.query.amount
    //         };
    //         paymentCondition['$studentSection.student.payable_amount$'] = {
    //             $gte: req.query.amount
    //         };
    //     }
    // }

    const includeStudent = {
        required: true,
        attributes: ['id', 'first_name', 'last_name', 'payable_amount','admission_no'],
        model: Student,
        as: 'student',
        include:[{
            required: true,
            attributes: ['id', 'contact_no','father_name'],
            model: Parent,
            as: 'parent',
        }

        ]
    };
    const includeClassSection = {
        required: true,
        attributes: ['id', 'name'],
        model: Section,
        as: 'section',
        include: [{
            required: true,
            attributes: ['id', 'name', 'sort'],
            model: Class,
            as: 'class',
        }]
    };

    Promise.all([
        commonFee.getSessionCollection(session_id),
        StudentSection.findAll({
            attributes: ['id', 'roll_no', 'student_type', 'status'],
            include: [includeStudent, includeClassSection],
            where: studentCondition,
            order: '`section.class.sort`, `section.name`, roll_no, `student.first_name`,`student.last_name`'
        }),

         TransportDiscount.findAll({
               attributes: ['id', 'status','student_section_id','amount','date','type','description'],
                include: [{
                required: true,
                attributes: ['id'],
                model: StudentSection,
                as: 'studentSection',
                include: [includeStudent, includeClassSection]
            }],
            where: paymentCondition
    })
    ]).then(([schoolCollection, student, payment]) => {
        return getStudentList(student, payment, (studentList) => {
            res.json({
                status: true,
                message: 'Fee report get successfully',
                data: {
                    schoolCollection,
                    student: studentList
                }
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transdiscount;

function getStudentList(student, payment, callback) {
    // let paid = 0;
    // let unpaid = 0;
    // let cash = 0;
    // let cheque = 0;
    // let bank = 0;
    // let online = 0;
    const finalArray = [];


   

 
 const result = [];
    payment.forEach(element => {
        element = element.get();

        if (!result.some((row) => { return row.student_section_id === element.student_section_id; })) {
        // console.log("149");
                                  result.push({

                                          student_section_id: element.student_section_id,
                                          dis_amount: element.amount,
                                           description:element.description,
                                       discount : [{
                                        description:element.description,
                                        amount : element.amount,
                                         created_at :element.date,
                                        status :element.status
                                      }]

                              })
        }else{
                const targetRow = result.filter((row) => { return row.student_section_id === element.student_section_id; })[0];
                              targetRow.dis_amount += parseInt(element.amount);
                              targetRow.discount.push({
                                         description:element.description,
                                         amount : element.amount,
                                         created_at :element.date,
                                         status :element.status
                                });

        }
       //console.log(targetRow)

       

});
///console.log("151")
//console.log(result)


     student.forEach(element => { 
        element = element.get();
       // console.log(element)
      // unpaid = unpaid + parseInt(element.student.payable_amount);
        
            if (result.some(function (row) {
            return row.student_section_id === element.id;
        })){
          //  paid = paid + parseInt(element.amount);
            const targetRow = result.filter((row) => { return row.student_section_id === element.id; })[0];
               console.log(targetRow)
         
     
                     //  console.log("targetRow")      
        //console.log(targetRow)

        finalArray.push({

          student_section_id: element.id,
            student_id: element.student.id,
            roll_no: element.roll_no,
            first_name: element.student.first_name,
            last_name: element.student.last_name,
            contact_no: element.student.parent.contact_no,
            admission_no:element.student.admission_no,
            father_name:element.student.parent.father_name,
            class: element.section.class.name,
            section: element.section.name,
          
          dis_amount: targetRow.dis_amount,
           
            discount: targetRow.discount,
            description:targetRow.description

        })

         //  
        

    }       

})

//console.log(finalArray)

    return callback({ studentList: finalArray });

}

