const fs = require('fs');
const db = require('../../database');
const Employee = db.models.Employee;

function profileImage(req, res, next) {
    const image = req.body.image;
    const id = req.body.id;

    const image_name = id + '.jpg';
    const path = './images/employee/' + image_name;

    fs.writeFile(path, image, 'base64', function (err) {
        if (err) {
            return console.log(err);
        }
        Employee.update({ photo: image_name }, { where: { id: id } }).then(() => {
            res.json({
                status: true,
                message: 'Employee image uploaded successfully'
            });
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = profileImage;
