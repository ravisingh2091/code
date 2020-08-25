const db = require('../../database');
const SectionName = db.models.SectionName;

function del(req, res, next) {
    SectionName.destroy({ where: { id: req.params.id } }).then(() => {
        res.json({
            status: true,
            message: 'Section name deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
