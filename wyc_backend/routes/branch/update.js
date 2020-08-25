const fs = require('fs');
const db = require('../../database');
const Branch = db.models.Branch;

function update(req, res, next) {
    const data = req.body;

    const updateForm = {};

    if (data.branch) {
        updateForm.branch = data.branch;
    }
    if (data.principal_name) {
        updateForm.principal_name = data.principal_name;
    }
    if (data.email) {
        updateForm.email = data.email;
    }
    if (data.secondary_email || data.secondary_email === '') {
        updateForm.secondary_email = data.secondary_email;
    }
    if (data.primary_no) {
        updateForm.primary_no = data.primary_no;
    }
    if (data.secondary_no || data.secondary_no === '') {
        updateForm.secondary_no = data.secondary_no;
    }
    if (data.affiliation_no || data.affiliation_no === '') {
        updateForm.affiliation_no = data.affiliation_no;
    }
    if (data.season) {
        updateForm.season = data.season;
    }
    if (data.summer_start_time) {
        updateForm.summer_start_time = data.summer_start_time;
    }
    if (data.winter_start_time) {
        updateForm.winter_start_time = data.winter_start_time;
    }
    if (data.summer_end_time) {
        updateForm.summer_end_time = data.summer_end_time;
    }
    if (data.winter_end_time) {
        updateForm.winter_end_time = data.winter_end_time;
    }
    if (data.website || data.website === '') {
        updateForm.website = data.website;
    }
    if (data.street || data.street === '') {
        updateForm.street = data.street;
    }
    if (data.city || data.city === '') {
        updateForm.city = data.city;
    }
    if (data.state || data.state === '') {
        updateForm.state = data.state;
    }
    if (data.country || data.country === '') {
        updateForm.country = data.country;
    }
    if (data.pincode || data.pincode === '') {
        updateForm.pincode = data.pincode;
    }
    if (data.min_attendance) {
        updateForm.min_attendance = data.min_attendance;
    }
    if (data.grace_mark_status) {
        updateForm.grace_mark_status = data.grace_mark_status;
    }
    if (data.max_grace_mark) {
        updateForm.max_grace_mark = data.max_grace_mark;
    }
    if (data.max_grace_subject) {
        updateForm.max_grace_subject = data.max_grace_subject;
    }
    if (data.rank_status) {
        updateForm.rank_status = data.rank_status;
    }
    if (data.start_admission_no) {
        updateForm.start_admission_no = data.start_admission_no;
    }
    if (data.auto_generate) {
        updateForm.auto_generate = data.auto_generate;
    }
    if (data.invoice_generation_day) {
        updateForm.invoice_generation_day = data.invoice_generation_day;
    }
    if (data.invoice_due_date_diff) {
        updateForm.invoice_due_date_diff = data.invoice_due_date_diff;
    }
    if (data.enable_late_fee) {
        updateForm.enable_late_fee = data.enable_late_fee;
    }
    if (data.late_fee_amt) {
        updateForm.late_fee_amt = data.late_fee_amt;
    }
    if (data.late_fee_min_amt) {
        updateForm.late_fee_min_amt = data.late_fee_min_amt;
    }
    if (data.recurring_late_duration) {
        updateForm.recurring_late_duration = data.recurring_late_duration;
    }
    if (data.trans_invoice_generation_day) {
        updateForm.trans_invoice_generation_day = data.trans_invoice_generation_day;
    }
    if (data.trans_invoice_due_date_diff) {
        updateForm.trans_invoice_due_date_diff = data.trans_invoice_due_date_diff;
    }
    if (data.sender_id || data.sender_id === '') {
        updateForm.sender_id = data.sender_id;
    }
    if (data.description || data.description === '') {
        updateForm.description = data.description;
    }
    if (data.latitude || data.latitude === '') {
        updateForm.latitude = data.latitude;
    }
    if (data.longitude || data.longitude === '') {
        updateForm.longitude = data.longitude;
    }

    Branch.update(updateForm, { where: { id: data.id } }).then(() => {
        if (data.logo) {
            const image_name = data.id + '.jpg';
            const path = './images/logo/' + image_name;
            return fs.writeFile(path, data.logo, 'base64', function (err) {
                if (err) {
                    return console.log(err);
                }
                Branch.update({ logo: image_name }, { where: { id: data.id } }).then(() => {
                    res.json({
                        status: true,
                        message: 'School info updated successfully'
                    });
                });
            });
        } else {
            res.json({
                status: true,
                message: 'School info updated successfully'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
