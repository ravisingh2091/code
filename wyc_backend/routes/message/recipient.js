const db = require('../../database');
const MessageRecipient = db.models.MessageRecipient;
const Section = db.models.Section;
const Class = db.models.Class;

function recipient(req, res, next) {
    MessageRecipient.findAll(
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
                message_id: req.params.msg_id
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
