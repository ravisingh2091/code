import nodemailer from 'nodemailer'
import {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_PASSWORD,
    EMAIL_USERNAME
} from '../config/index'

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE, // use SSL
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

export const sendMail = ({ to, subject, html }) => {
    let mailOptions = {
        from: `Zimble ${EMAIL_USERNAME}`,
        to,
        subject,
        html
    }

    return transporter.sendMail(mailOptions)
}