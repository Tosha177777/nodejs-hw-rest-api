const nodemailer = require("nodemailer");
const { HttpError } = require("../utils");

const verifySender = async (req, token, email) => {
  try {
    const verURL = `${req.protocol}://${req.get("host")}/users/verify/${token}`;

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS,
      },
    });
    const emailConfig = {
      from: "Account verification <service@example.com>",
      to: email,
      subject: `Account verification`,
      html: `<p>Please, verify your account</p> <a>${verURL}</a>`,
      text: "Hello from GoIT",
    };

    await transport.sendMail(emailConfig);
  } catch (error) {
    console.log("error: ", error.message);
    throw new HttpError(error.message);
  }
};

module.exports = verifySender;
