import bcrypt from 'bcrypt';
import mongoose from '../db';
import { PASS_HASH_ROUNDS, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_NAME, AMDIN_PASSWORD } from '../config';

const Admin = new mongoose.Schema({
    name: {
        type: String
    },
    userType: {
        type: String,
        enum: ['Admin'],
        default: 'Admin'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    username: {
        type: String
    },
    adminToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '1'
    }
}, { timestamps: true });



Admin.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}

const AdminModel = mongoose.model('Admins', Admin);
module.exports = AdminModel


AdminModel.findOne({}, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        if (!success) {
            bcrypt.genSalt(+PASS_HASH_ROUNDS, (err, salt) => {
                if (err) {
                    throw err;
                }
                bcrypt.hash(AMDIN_PASSWORD, salt, (err, hash) => {
                    new AdminModel({
                        email: ADMIN_EMAIL,
                        password: hash,
                        username: ADMIN_USERNAME,
                        name: ADMIN_NAME
                    }).save((error, success) => {
                        if (error) {
                            console.log("Error in creating admin");
                        }
                        else {
                            console.log("Admin created successfully");
                            console.log("Admin data is==========>", success);
                        }
                    })
                });
            });
        }
    }
})






