const fs = require('fs');
const utils = require('../../lib/utils');
const db = require('../../database');
const Driver = db.models.Driver;

function update(req, res, next) {
    const data = req.body;

    Driver.findOne({
        attributes: ['id'],
        where: {
            mobile_no: data.mobile_no,
            id: {
                $ne: data.id
            }
        }
    }).then((driverInfo) => {
        if (!driverInfo) {
            return Driver.update({
                branch_id: req.query.branch_id,
                first_name: data.first_name,
                last_name: data.last_name,
                father_name: data.father_name,
                email: data.email,
                dob: utils.formatDate(data.dob),
                license_no: data.license_no,
                joining_date: data.joining_date ? utils.formatDate(data.joining_date) : null,
                aadhar_no: data.aadhar_no,
                imei: data.imei,
                salary: data.salary,
                nationality: data.nationality,
                present_street: data.present_street,
                present_city: data.present_city,
                present_state: data.present_state,
                present_country: data.present_country,
                present_pincode: data.present_pincode,
                parmanent_street: data.parmanent_street,
                parmanent_city: data.parmanent_city,
                parmanent_state: data.parmanent_state,
                parmanent_country: data.parmanent_country,
                parmanent_pincode: data.parmanent_pincode,
                type: data.type
            }, { where: { id: data.id } }).then(() => {
                if (data.photo) {
                    const image_name = data.id + '.jpg';
                    const path = './images/driver/' + image_name;
                    return fs.writeFile(path, data.photo, 'base64', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        Driver.update({ photo: image_name }, { where: { id: data.id } }).then(() => {
                            res.json({
                                status: true,
                                message: 'Driver info updated successfully'
                            });
                        });
                    });
                } else {
                    res.json({
                        status: true,
                        message: 'Driver info updated successfully'
                    });
                }
            });
        } else {
            res.json({
                status: false,
                message: 'Driver mobile no already exists'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
