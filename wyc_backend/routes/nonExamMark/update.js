const db = require('../../database');
const NonExamMark = db.models.NonExamMark;

function update(req, res, next) {
    const data = req.body;
    NonExamMark.update({ remarks: data.remarks }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Non exam marks updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
