import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD, 
    }
})

export async function sendEmail(to: string , body: string){
    await transporter.sendMail({
        from: "kartikeysharma.sharma@gmail.com",
        sender: "kartikeysharma.sharma@gmail.com",
        to,
        subject: "Hello from Zapi",
        text: body,

    })
}