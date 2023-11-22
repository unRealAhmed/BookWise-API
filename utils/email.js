const nodemailer = require('nodemailer');
const EventEmitter = require('events');

const emailEventEmitter = new EventEmitter();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fullname.split(' ')[0];
    this.url = url;
    this.from = 'Library Team <ahmed@library.io>';
  }

  // Send an email with specified subject and message
  async send(subject, message, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message || '',
      html
    };

    // Emit the 'sendEmail' event with mailOptions
    emailEventEmitter.emit('sendEmail', mailOptions);
  }

  async sendWelcomeEmail() {
    const subject = 'Welcome To Our Library Community 📚';
    const message = `Hello ${this.firstName}! 🎉
    
    Welcome to our Library App! We're thrilled to have you as a part of our community of book lovers. Get ready to discover a world of literature, borrow your favorite books, and dive into the joy of reading. Whether you're into fiction, non-fiction, or something in between, our library has something for everyone. 📖
    
    Explore our collection, and let the adventure begin! 🌟
    
    Happy reading!
    The Library App Team 📚`;

    await this.send(subject, null, message);
  }

  async sendPasswordResetEmail(html) {
    const subject = "Password Reset Request for Your Library Account 🛡️"
    const message = 'hi'
    await this.send(subject, message, html);
  }
};

emailEventEmitter.on('sendEmail', async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASS_KEY,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
