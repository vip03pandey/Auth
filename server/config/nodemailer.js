import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // false for port 587 (STARTTLS)
    auth: {
        user:"87fbb8002@smtp-brevo.com",
        pass: "7BHExUCpIacRKzWh"
    },
});
// console.log(process.env.SMTP_USER, process.env.SMTP_PASSWORD, process.env.SMTP_EMAIL);


export default transporter;
