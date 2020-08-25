const db = require('../../database');
const Exam = db.models.Exam;

function update(req, res, next) {
    const data = req.body;
    Exam.findOne({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            id: {
                $ne: data.id
            }
        }
    }).then((exam) => {
        if (!exam) {
            return Exam.update({ name: data.name }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Exam name updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Exam name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
