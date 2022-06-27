let transporter = nodemailer.createTransport({
    service: 'ICloud', // no need to set host or port etc.
    auth: {
        user: 'hi.lottie@icloud.com',
        pass: 'mZxK6Vw24!rFv4IAYPf'
    }
});

transporter.sendMail(...)