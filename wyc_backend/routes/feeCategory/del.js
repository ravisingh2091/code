const db = require('../../database');
const FeeCategory = db.models.FeeCategory;
const Student = db.models.Student;
const FeeStructureInfo = db.models.FeeStructureInfo;

function del(req, res, next) {
    const fee_category_id = req.params.id;
    Promise.all([
        Student.findOne({ where: { fee_category_id } }),
        FeeStructureInfo.findOne({ where: { fee_category_id } })
    ]).then(([student, feeStructure]) => {
        if (!student && !feeStructure) {
            return FeeCategory.destroy({ where: { id: fee_category_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Fee Category deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Fee Category is assigned. So we cannot delete fee category'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
