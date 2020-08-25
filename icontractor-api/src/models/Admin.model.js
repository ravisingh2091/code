import mongoose from '../db';
import bcrypt from 'bcrypt';
import { PASS_HASH_ROUNDS, ADMIN_EMAIL, ADMIN_NAME, AMDIN_PASSWORD } from '../config';
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    adminToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    }
});


UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}
const AdminModel = mongoose.model('Admins', UserSchema);
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
                        name: ADMIN_NAME
                    }).save((error, success) => {
                        if (error) {
                            console.log("Error in creating admin");
                        }
                        else {
                            console.log("Admin created successfully");
                        }
                    })
                });
            });
        }
    }
})



