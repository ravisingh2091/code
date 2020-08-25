const db = require('../../database');
const NoticeRecipient = db.models.NoticeRecipient;
const Section = db.models.Section;
const Class = db.models.Class;

function recipient(req, res, next) {
    NoticeRecipient.findAll(
        {
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }]
            }],
            where: {
                notice_id: req.params.notice_id
            }
        }
    ).then((result) => {
        res.json({
            status: true,
            message: 'Recipients listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = recipient;
