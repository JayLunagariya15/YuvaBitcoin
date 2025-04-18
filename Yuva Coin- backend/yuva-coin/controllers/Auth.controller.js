// require("dotenv").config();
// const connection = require("../config/db.config");
// const { promisify } = require("util");
// const query = promisify(connection.query).bind(connection);

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// const getRegister = async (req, res) => {
//   let sponcer_id = req.query.sponcer_id;
//   let query1 = `SELECT * FROM tbl_memberreg WHERE member_user_id='${sponcer_id}'`;
//   const checkSponcer = await query(query1);
//   if (checkSponcer.length === 0) {
//     return res.status(400).send({
//       status: false,
//       message: "Invalid sponcer id",
//     });
//   }
//   let sponcer_name = checkSponcer[0].member_name;
//   return res.status(200).send({
//     status: true,
//     sponcer_name: sponcer_name,
//     sponcer_id: sponcer_id,
//   });
// };

// const register = async (req, res) => {
//   let sponcer_id = req.query.sponcer_id;
//   let member_user_id;
//   let query1 = `SELECT * FROM tbl_memberreg WHERE member_user_id='${sponcer_id}'`;
//   const checkSponcer = await query(query1);
//   if (checkSponcer.length === 0) {
//     return res.status(400).send({
//       status: false,
//       message: "Invalid sponcer id",
//     });
//   }

//   let sponcer_name = checkSponcer[0].member_name;
//   let contactNo = req.body.contactNo.trim();
//   let member_name = req.body.member_name.trim().toUpperCase();
//   let password = req.body.password.trim();
//   let cpassword = req.body.cpassword.trim();
//   let email = req.body.email.trim().toLowerCase();

//   if (password !== cpassword) {
//     return res.status(400).send({
//       status: false,
//       message: "Password and confirm password not matched",
//     });
//   }

//   const checkEmail = `SELECT * FROM tbl_memberreg WHERE email='${email}'`;
//   const checkEmailResult = await query(checkEmail);
//   if (checkEmailResult.length > 0) {
//     return res.status(400).send({
//       status: false,
//       message: "Email already registered",
//     });
//   }

//   let reg_date = new Date().toISOString().replace("T", " ").replace("Z", "");

//   console.log(`reg_date`, reg_date);

//   if (member_name.length < 3) {
//     res.status(400).send({
//       title: "Error",
//       message: "Fill Member Name",
//       status: "error",
//     });
//   } else if (contactNo.length !== 10) {
//     res.status(400).send({
//       title: "Error",
//       message: "Fill Valid Mobile No",
//       status: "error",
//     });
//   } else if (!phoneValidation(contactNo)) {
//     res.status(400).send({
//       title: "Error",
//       message: "Fill Valid Mobile Name",
//       status: "error",
//     });
//   } else if (!emailValidation(email)) {
//     res.status(400).send({
//       title: "Error",
//       message: "Fill Valid Email Id",
//       status: "error",
//     });
//   } else if (password.length < 6) {
//     res.status(400).send({
//       title: "Error",
//       message: "Password Must be 6 Charactor",
//       status: "error",
//     });
//   } else if (password !== cpassword) {
//     res.status(400).send({
//       title: "Error",
//       message: "Password and Confirm Password do not match",
//       status: "error",
//     });
//   } else {
//     member_user_id = generateRandomNumber();

//     let checkMemberId = `SELECT * FROM tbl_memberreg WHERE member_user_id='${member_user_id}'`;
//     let checkMemberIdResult = await query(checkMemberId);

//     while (checkMemberIdResult.length > 0) {
//       member_user_id = generateRandomNumber();
//       checkMemberId = `SELECT * FROM tbl_memberreg WHERE member_user_id='${member_user_id}'`;
//       checkMemberIdResult = await query(checkMemberId);
//     }
//   }

//   const salt = await bcrypt.genSalt(10);
//   password = await bcrypt.hash(password, salt);

//   let insertQuery = `INSERT INTO tbl_memberreg (member_user_id, sponcer_id, sponcer_name, member_name, contact, email, password, registration_date) VALUES ('${member_user_id}', '${sponcer_id}', '${sponcer_name}', '${member_name}', '${contactNo}', '${email}', '${password}', '${reg_date}')`;

//   try {
//     const insertResult = await query(insertQuery);
//     return res.status(200).send({
//       status: true,
//       message: "Registration successfully",
//       userId: member_user_id,
//     });
//   } catch (err) {
//     console.log("Error in registration", err);
//     return res.status(400).send({
//       status: false,
//       message: "Registration failed",
//     });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   const checkUserQuery = `SELECT * FROM tbl_memberreg WHERE email = '${email}'`;
//   const checkUser = await query(checkUserQuery);
//   if (checkUser.length === 0) {
//     return res.status(400).send({
//       status: false,
//       message: "Invalid email!",
//     });
//   } else {
//     const validPassword = await bcrypt.compare(password, checkUser[0].password);
//     if (!validPassword) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid password!",
//       });
//     }

//     const token = jwt.sign(
//       { userId: checkUser[0].member_user_id },
//       JWT_SECRET_KEY,
//       {
//         expiresIn: "1h",
//       }
//     );

//     const user = checkUser[0];

//     const returnObject = {
//       member_user_id: user.member_user_id,
//       member_name: user.member_name,
//       sponcer_id: user.sponcer_id,
//       sponcer_name: user.sponcer_name,
//       wallet_address: user.wallet_address,
//       promoter_id: user.promoter_id,
//       promoter_name: user.promoter_name,
//       contact: user.contact,
//       email: user.email,
//       status: user.status,
//       registration_date: user.registration_date,
//       member_status: user.member_status,
//       kyc_status: user.kyc_status,
//       topup_amount: user.topup_amount,
//       direct_member: user.direct_member,
//       wallet_amount: user.wallet_amount,
//       checked: user.checked,
//       withdrawal_amt: user.withdrawal_amt,
//       block_status: user.block_status,
//       current_investment: user.current_investment,
//       direct_business: user.direct_business,
//       total_earning: user.total_earning,
//       isblock: user.isblock,
//       team_business: user.team_business,
//       expiry_date: user.expiry_date,
//       expiry_date2: user.expiry_date2,
//       team_member: user.team_member,
//       activation_date: user.activation_date,
//       profile_image: user.profile_image,
//       front_image: user.front_image,
//       back_image: user.back_image,
//       member_dob: user.member_dob,
//       address: user.address,
//       pincod: user.pincod,
//       gender: user.gender,
//       country_code: user.country_code,
//       state: user.state,
//       city: user.city,
//       calTeamStatus: user.calTeamStatus,
//       updateWallet: user.updateWallet,
//     };

//     return res.status(200).send({
//       status: true,
//       message: "Login successfully",
//       token,
//       user: returnObject,
//     });
//   }
// };

// function generateRandomNumber() {
//   const min = 1000000; // Minimum 7-digit number (inclusive)
//   const max = 9999999; // Maximum 7-digit number (inclusive)

//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function phoneValidation(phone) {
//   phone = testInput(phone);
//   if (/^\d{10}$/.test(phone)) {
//     return true;
//   } else {
//     return false;
//   }
// }
// function emailValidation(email) {
//   let emailVal =
//     /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
//   email = testInput(email);
//   if (emailVal.test(email)) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function testInput(data) {
//   data = data.trim();
//   data = data.replace(/\\/g, "");
//   data = htmlspecialchars(data);
//   return data;
// }

// function htmlspecialchars(str) {
//   str = str.replace(/&/g, "&amp;");
//   str = str.replace(/</g, "&lt;");
//   str = str.replace(/>/g, "&gt;");
//   str = str.replace(/"/g, "&quot;");
//   str = str.replace(/'/g, "&#039;");
//   return str;
// }

// module.exports = {
//   register,
//   login,
//   getRegister,
// };

// pass: 'pvvw lqvk axxs kwha' // Your Gmail password or app password
const nodemailer = require('nodemailer');
const Member = require('../models/memberModel');
const Admin = require('../models/AdminModel');
const TemporaryRegistration = require('../models/TemporaryRegistration');
const TemporaryPasswordReset = require('../models/TemporaryPasswordReset');
const TemporaryAdminOTP = require('../models/TemporaryAdminOTP');
const Permission = require('../models/permission.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const fs = require('fs');
const path = require('path');
const ReferralHistory = require('../models/referralModel');
const AdminControl = require('../models/AdminControl.Model');
const { log } = require('console');
const { isNull } = require('util');


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Function to generate a random number
function generateRandomNumber() {
  const prefix = "YBM";
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate random 4-digit number
  return `${prefix}${randomNumber}`;
}

// let serialNumberCounter = 1;

// function generateRandomNumber() {
//   const prefix = "YBM";
//   const serialNumber = String(serialNumberCounter).padStart(7, "0"); // Ensure 6 digits with leading zeros
//   serialNumberCounter++; // Increment serial number counter for next call
//   return `${prefix}${serialNumber}`;
// }


function generateRandomNumberAdmin() {
  const prefix = "YBSA";
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
  return `${prefix}${randomNumber}`;
}
///=========================================================================================================================

// Function to send OTP to email
async function sendOTP(email, otp, member_name) {
  try {

    const imagePath = path.resolve(__dirname, '../public/logo.png')
    // const images = fs.readFileSync(imagePath)

    // const base64Image = Buffer.from(images).toString('base64')

    // Path to your HTML file
    const templatePath = path.resolve(__dirname, '../template/emailTemplate/index.html');
    // Read the template file
    let html = fs.readFileSync(templatePath, 'utf8');
    // Replace placeholders with actual values
    html = html.replace('[OTP_Code]', otp);


    const memberName = await TemporaryRegistration.find({ email });
    console.log(memberName);
    if (memberName.length > 0) {
      html = html.replace('[edgar]', memberName[0].registrationData.member_name);
    }

    // Replace the <img> src attribute with base64 encoded image
    // html = html.replace('<img src="./images/yuva200px.png" alt="logo"', `<img src="data:image/png;base64,${base64Image}" alt="logo"`);


    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false, // Set to true for a secure connection
    //   auth: {
    //     user: '191260107039setice@gamil.com', // Your Gmail email address
    //     pass: 'yuts qvzx fuqs gbtz' // Your Gmail password
    //   }
    // });

    // const mailOptions = {
    //   from: '191260107039setice@gamil.com',
    //   to: email, 
    //   subject: 'OTP Verification',
    //   // text: `Your OTP for registration is: ${otp}`
    //   html: html
    // };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use false for TLS
        auth: {
          user: '191260107039setice@gmail.com', // Your Gmail email address
          pass: 'yuts qvzx fuqs gbtz' // Your app password
        }
      });
    
      const mailOptions = {
        from: '191260107039setice@gmail.com',
        to: email, // Change this to a valid recipient email
        // subject: 'Test Email',
        // text: 'This is a test email sent using Nodemailer!'
        subject: 'OTP Verification',
        html: html
      };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully.', email, otp);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP.');
  }
}
async function sendOTPForgotPassword(email, otp, member_name) {
  try {

    const imagePath = path.resolve(__dirname, '../public/logo.png')
    // const images = fs.readFileSync(imagePath)

    // const base64Image = Buffer.from(images).toString('base64')

    // Path to your HTML file
    const templatePath = path.resolve(__dirname, '../template/emailTemplate/forgotPassword.html');
    // Read the template file
    let html = fs.readFileSync(templatePath, 'utf8');
    // Replace placeholders with actual values
    html = html.replace('[OTP_Code]', otp);


    const memberName = await TemporaryRegistration.find({ email });
    console.log(memberName);
    if (memberName.length > 0) {
      html = html.replace('[edgar]', memberName[0].registrationData.member_name);
    }

    // Replace the <img> src attribute with base64 encoded image
    // html = html.replace('<img src="./images/yuva200px.png" alt="logo"', `<img src="data:image/png;base64,${base64Image}" alt="logo"`);


    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false, // Set to true for a secure connection
    //   auth: {
    //     user: '191260107039setice@gamil.com', // Your Gmail email address
    //     pass: 'yuts qvzx fuqs gbtz' // Your Gmail password
    //   }
    // });

    // const mailOptions = {
    //   from: '191260107039setice@gamil.com',
    //   to: email,
    //   subject: 'OTP Verification',
    //   // text: `Your OTP for registration is: ${otp}`
    //   html: html
    // };

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use false for TLS
      auth: {
        user: '191260107039setice@gmail.com', // Your Gmail email address
        pass: 'yuts qvzx fuqs gbtz' // Your app password
      }
    });
  
    const mailOptions = {
      from: '191260107039setice@gmail.com',
      to: email, // Change this to a valid recipient email
      // subject: 'Test Email',
      // text: 'This is a test email sent using Nodemailer!'
      subject: 'OTP Verification',
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully.', email, otp);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP.');
  }
}

// Function to generate a random 6-digit OTP 
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

///=========================================================================================================================
async function register(req, res) {
  const registerSchema = Joi.object({
    contactNo: Joi.string().trim().min(10).max(10).required(),
    member_name: Joi.string().trim().min(3).required(),
    password: Joi.string().trim().min(6).required(),
    email: Joi.string().trim().email().lowercase().required(),
    twitterId: Joi.string().trim(),
    wallet_address: Joi.string().trim().required(),
    referralCode: Joi.string().allow('').optional(),
  });

  try {
    // Validate request body parameters
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }
    let { contactNo, member_name, password, email, twitterId, wallet_address, referralCode } = value;

    // Check if the email is already registered
    const existingMember = await Member.findOne({ email: email });
    if (existingMember) {
      return res.status(400).send({
        status: false,
        message: "Email already registered",
      });
    }

    // Check if the contact number is already registered
    const existingMemberContact = await Member.findOne({ contactNo: contactNo });
    if (existingMemberContact) {
      return res.status(400).send({
        status: false,
        message: "Contact number already registered",
      });
    }

    const existingMemberTwitter = await Member.findOne({ twitterId: twitterId });
    if (existingMemberTwitter) {
      return res.status(400).send({
        status: false,
        message: "Twitter id already registered",
      });
    }

    const existingMemberWallet = await Member.findOne({ wallet_address: wallet_address });
    if (existingMemberWallet) {
      return res.status(400).send({
        status: false,
        message: "Wallet address already registered",
      })
    }



    // referalcode not given then save value ' if given then save taht value which is in req.body
    // referralCode = referralCode ? await Member.findOne({ member_user_id: referralCode })?.member_user_id : "";
    const isReferralCodeEmpty = !referralCode || referralCode.trim() === "";

    if (isReferralCodeEmpty) {
      // If referral code is empty, set it to an empty string
      referralCode = "";
    } else {
      // Check if the referral code exists in the Member collection
      const existingReferralMember = await Member.findOne({ member_user_id: referralCode });
      if (!existingReferralMember) {
        return res.status(400).send({
          status: false,
          message: "Invalid referral code",
        });
      }
    }
    // const isreferralCode = await Member.findOne({ member_user_id: referralCode })

    // if (isreferralCode === "") {

    //   referralCode = "";
    // }


    // if (!isreferralCode) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Invalid referral code",
    //   });
    // }



    // Check if there's an existing temporary registration for the same email
    const existingTemporaryRegistration = await TemporaryRegistration.findOne({ email });
    if (existingTemporaryRegistration) {
      // Generate new OTP
      const otp = generateOTP();

      // Update existing temporary registration data
      existingTemporaryRegistration.otp = otp;
      existingTemporaryRegistration.registrationData = {
        contactNo,
        member_name,
        password,
        email,
        twitterId,
        wallet_address,
        referralCode,
      };
      await existingTemporaryRegistration.save();

      // Send OTP via email
      await sendOTP(email, otp);

      return res.status(200).send({
        status: true,
        message: "OTP sent to your email for verification",
        email: email,
      });
    }
    // Generate OTP
    const otp = generateOTP();

    // Save registration data to temporary storage
    const temporaryRegistration = new TemporaryRegistration({
      email,
      otp,
      registrationData: {
        contactNo,
        member_name,
        password,
        email,
        twitterId,
        wallet_address,
        referralCode,
      }
    });
    await temporaryRegistration.save();

    // Send OTP via email
    await sendOTP(email, otp);

    return res.status(200).send({
      status: true,
      message: "OTP sent to your email for verification",
      email: email,
    });
  } catch (err) {
    console.log("Error in registration", err);
    return res.status(400).send({
      status: false,
      message: "Registration failed",
    });
  }
}

// async function verifyOTP(req, res) {
//   const { otp: otpFromBody, email } = req.body; // Extract OTP and email from request body

//   try {
//     if (!otpFromBody || !email) { // Check if OTP or email is missing
//       return res.status(400).json({
//         status: false,
//         message: "OTP and email are required"
//       });
//     }
//     const acontrol = await AdminControl.find({});
//     // Check if AdminControl document exists
//     if (!acontrol) {
//       return res.status(400).json({
//         status: false,
//         message: "Admin control settings not found"
//       });
//     }
//     // Log the fetched value of acontrol.setRegisterCoinValue
//     console.log("acontrol.setRegisterCoinValue:", acontrol.setRegisterCoinValue);

//     // Find temporary registration data by OTP and email
//     const temporaryRegistrationFromBody = await TemporaryRegistration.findOne({ otp: otpFromBody, email: email }).sort({ createdAt: -1 });

//     if (!temporaryRegistrationFromBody) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid OTP or email"
//       });
//     }

//     // Verify that the OTP matches
//     if (temporaryRegistrationFromBody.otp !== otpFromBody) {
//       return res.status(400).send({
//         status: false,
//         message: "OTP does not match"
//       });
//     }

//     // Find member by email
//     let existingMember = await Member.findOne({ email });
//     // If member exists, update the data, otherwise create a new member
//     if (existingMember) {
//       // Update existing member data
//       const { contactNo, member_name, password, twitterId, wallet_address, referralCode } = temporaryRegistrationFromBody.registrationData;
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       existingMember.member_name = member_name;
//       existingMember.contactNo = contactNo;
//       existingMember.wallet_address = wallet_address;
//       existingMember.password = hashedPassword;
//       existingMember.twitterId = twitterId;
//       existingMember.isActive = true;

//       // Set coins value to acontrol.setRegisterCoinValue
//       existingMember.coins = acontrol.setRegisterCoinValue;

//       await existingMember.save();
//     } else {
//       // Create new member instance using registration data
//       const { contactNo, member_name, password, twitterId, wallet_address, referralCode } = temporaryRegistrationFromBody.registrationData;
//       const reg_date = new Date();
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const newMember = new Member({
//         member_user_id: generateRandomNumber(),
//         member_name,
//         contactNo,
//         wallet_address,
//         email,
//         password: hashedPassword,
//         registration_date: reg_date,
//         twitterId,
//         isActive: true,
//         coins: acontrol.setRegisterCoinValue,
//         referralCode
//       });

//       // Save the member to the database
//       await newMember.save();
//     }

//     // Delete temporary registration data
//     await temporaryRegistrationFromBody.deleteOne();

//     return res.status(200).send({
//       status: true,
//       message: "Registration successful"
//     });
//   } catch (err) {
//     console.log("Error in OTP verification", err);
//     return res.status(400).send({
//       status: false,
//       message: "OTP verification failed"
//     });
//   }
// }

const baseTwitterURL = "https://twitter.com/";

async function verifyOTP(req, res) {
  const { otp: otpFromBody, email } = req.body; // Extract OTP and email from request body

  try {
    if (!otpFromBody || !email) { // Check if OTP or email is missing
      return res.status(400).json({
        status: false,
        message: "OTP and email are required"
      });
    }

    // Find AdminControl document
    const acontrol = await AdminControl.findOne({}, {}, { sort: { updatedAt: -1 } }).limit(1);
    // Check if AdminControl document exists
    if (!acontrol) {
      return res.status(400).json({
        status: false,
        message: "Admin control settings not found"
      });
    }
    // Log the fetched value of acontrol.setRegisterCoinValue
    console.log("acontrol.setRegisterCoinValue:", acontrol.setRegisterCoinValue);

    // Find temporary registration data by OTP and email
    const temporaryRegistrationFromBody = await TemporaryRegistration.findOne({ otp: otpFromBody, email: email }).sort({ createdAt: -1 });

    if (!temporaryRegistrationFromBody) {
      return res.status(400).send({
        status: false,
        message: "Invalid OTP or email"
      });
    }

    // Verify that the OTP matches
    if (temporaryRegistrationFromBody.otp !== otpFromBody) {
      return res.status(400).send({
        status: false,
        message: "OTP does not match"
      });
    }

    // Find member by email
    let existingMember = await Member.findOne({ email });
    // If member exists, update the data, otherwise create a new member
    if (existingMember) {
      // Update existing member data
      const { contactNo, member_name, password, twitterId, wallet_address, referralCode } = temporaryRegistrationFromBody.registrationData;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingMember.member_name = member_name;
      existingMember.contactNo = contactNo;
      existingMember.wallet_address = wallet_address;
      existingMember.password = hashedPassword;
      existingMember.twitterId = baseTwitterURL + twitterId;
      existingMember.isActive = true;
      // For D
      // Set coins value to acontrol.setRegisterCoinValue
      existingMember.coins = acontrol.setRegisterCoinValue;

      await existingMember.save();
    } else {
      // Create new member instance using registration data
      const { contactNo, member_name, password, twitterId, wallet_address, referralCode } = temporaryRegistrationFromBody.registrationData;
      const reg_date = new Date();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newMember = new Member({
        member_user_id: generateRandomNumber(),
        member_name,
        contactNo,
        wallet_address,
        email,
        password: hashedPassword,
        registration_date: reg_date,
        twitterId: baseTwitterURL + twitterId,
        isActive: true,
        coins: acontrol.setRegisterCoinValue,
        referralCode
      });

     // Save the referral history
    // const referralCreate = new ReferralHistory({
    //   user_id: newMember.member_user_id,
    //   user_name: newMember.member_name,
    //   user_earned: 0,
    //   referral_code: newMember.referralCode,
    //   referral_user: newMember.member_user_id,
    //   referral_user_name: newMember.member_name,
    //   referral_user_isRefered: false
    // });

    // await referralCreate.save();

      
      // Save the member to the database
      await newMember.save();
    }

    // Delete temporary registration data
    await temporaryRegistrationFromBody.deleteOne();



    return res.status(200).send({
      status: true,
      message: "Registration successful"
    });
  } catch (err) {
    console.log("Error in OTP verification", err);
    return res.status(400).send({
      status: false,
      message: "OTP verification failed"
    });
  }
}

function phoneValidation(phone) {
  phone = testInput(phone);
  if (/^\d{10}$/.test(phone)) {
    return true;
  } else {
    return false;
  }
}
function emailValidation(email) {
  let emailVal =
    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  email = testInput(email);
  if (emailVal.test(email)) {
    return true;
  } else {
    return false;
  }
}

function testInput(data) {
  data = data.trim();
  data = data.replace(/\\/g, "");
  data = htmlspecialchars(data);
  return data;
}

function htmlspecialchars(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}

// async function register(req, res) {
//   try {
//     const { sponcer_id, contactNo, member_name, password, cpassword, email } = req.body;

//     // Check if password and confirm password match
//     if (password !== cpassword) {
//       return res.status(400).send({
//         status: false,
//         message: "Password and confirm password not matched",
//       });
//     }

//     // Check if email is already registered
//     const existingMember = await Member.findOne({ email });
//     if (existingMember) {
//       return res.status(400).send({
//         status: false,
//         message: "Email already registered",
//       });
//     }

//     // Create new member
//     const member = new Member({
//       sponcer_id,
//       contactNo,
//       member_name: member_name, //.toUpperCase()
//       password,
//       email,
//     });
//     await member.save();

//     res.status(200).send({
//       status: true,
//       message: "Registration successfully",
//       userId: member._id,
//     });
//   } catch (error) {
//     console.error('Error in registration:', error);
//     res.status(500).send({ status: false, message: 'Internal Server Error' });
//   }
// }

// Function to generate OTP

//==============================================================================================================================

// async function register(req, res) {
//   const registerSchema = Joi.object({
//     contactNo: Joi.string().trim().min(10).max(10).required(),
//     member_name: Joi.string().trim().min(3).required(),
//     password: Joi.string().trim().min(6).required(),
//     email: Joi.string().trim().email().lowercase().required(),
//     twitterId: Joi.string().trim(),
//     wallet_address: Joi.string().trim().required(),
//   });

//   try {
//     // Validate request body parameters
//     const { error, value } = registerSchema.validate(req.body);
//     if (error) {
//       return res.status(400).send({
//         status: false,
//         message: error.details[0].message,
//       });
//     }
//     let { contactNo, member_name, password, email, twitterId, wallet_address } = value;


//     // Check if the email is already registered
//     const existingMember = await Member.findOne({ email: email });
//     if (existingMember) {
//       return res.status(400).send({
//         status: false,
//         message: "Email already registered",
//       });
//     }


//     // Check if the contact number is already registered
//     const existingMemberContact = await Member.findOne({ contactNo: contactNo });
//     if (existingMemberContact) {
//       return res.status(400).send({
//         status: false,
//         message: "Contact number already registered",
//       });
//     }




//     let reg_date = new Date();

//     if (member_name.length < 3 || contactNo.length !== 10 || !phoneValidation(contactNo) || !emailValidation(email) || password.length < 6) {
//       return res.status(400).send({
//         title: "Error",
//         message: "Invalid data provided",
//         status: "error",
//       });
//     }

//     member_user_id = generateRandomNumber();

//     let member = await Member.findOne({ member_user_id: member_user_id });
//     while (member) {
//       member_user_id = generateRandomNumber();
//       member = await Member.findOne({ member_user_id: member_user_id });
//     }

//     const salt = await bcrypt.genSalt(10);
//     password = await bcrypt.hash(password, salt);

//     // Create new member instance
//     const newMember = new Member({
//       member_user_id,
//       member_name,
//       contactNo: contactNo,
//       wallet_address,
//       email,
//       password,
//       registration_date: reg_date,
//       twitterId,
//       isActive: true,
//       // isBlocked: false,
//     });

//     // Save the member to the database
//     await newMember.save();

//     return res.status(200).send({
//       status: true,
//       message: "Registration successfully",
//       userId: member_user_id,
//     });
//   } catch (err) {
//     console.log("Error in registration", err);
//     return res.status(400).send({
//       status: false,
//       message: "Registration failed",
//     });
//   }
// };


async function login(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = value;
    const user = await Member.findOne({ email: email });

    console.log(user)
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid email!",
      });
    } else {

      const validPassword = await bcrypt.compare(password, user.password);

      console.log(validPassword)

      if (!validPassword) {
        return res.status(400).send({
          status: false,
          message: "Invalid password!",
        });
      }


      const token = jwt.sign(
        { userId: user.member_user_id, userType: user.userType },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '100d'
        }
      );

      const returnObject = {
        member_user_id: user.member_user_id,
        member_name: user.member_name,
        sponcer_id: user.sponcer_id,
        sponcer_name: user.sponcer_name,
      };

      return res.status(200).send({
        status: true,
        message: "Login successfully",
        token,
        user: returnObject,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

async function getRegister(req, res) {
  try {
    const sponcer_id = req.query.sponcer_id;

    // Find sponsor by ID
    const sponcer = await Member.findById(sponcer_id);
    if (!sponcer) {
      return res.status(400).send({
        status: false,
        message: "Invalid sponsor id",
      });
    }

    res.status(200).send({
      status: true,
      sponcer_name: sponcer.member_name,
      sponcer_id,
    });
  } catch (error) {
    console.error('Error in getRegister:', error);
    res.status(500).send({ status: false, message: 'Internal Server Error' });
  }
}

async function adminRegister(req, res) {
  const schema = Joi.object({
    admin_name: Joi.string().required(),
    userType: Joi.string(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  });
  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }
    // Extract data from validated request body
    const { admin_name, password, email, userType } = value;

    // Check if email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({
        status: false,
        message: "Email already registered",
      });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const admin_user_id = generateRandomNumberAdmin();

    // Create new admin instance
    const newAdmin = new Admin({
      admin_user_id,
      admin_name,
      password,
      userType: userType ? userType : 'admin',
      email,
    });

    // Save the admin to the database
    const response = await newAdmin.save();

    //if userType is agent then create Permission Data for that agent
    if (userType === "agent" || userType === "admin") {
      const permission = new Permission({
        admin_user_id: admin_user_id,
        setCoinValueMarketUsdt: false,
        setMinimumAmountMarketUsdt: false,
        setMinimumWithdrawal: false,
        setMaximumWithdrawal: false,
        setRegisterCoinValue: false,
        setReferralCoinValue: false,
        setStakeMonth1: false,
        setStakeMonth2: false,
        setStakeMonth3: false,
        setStakePercent1: false,
        setStakePercent2: false,
        setStakePercent3: false,
        isActive: true
      })
      await permission.save();
    }

    console.log(response);
    if (userType === "agent") {
      return res.status(200).send({
        status: true,
        message: "Agent Registration successful",
      });
    }
    return res.status(200).send({
      status: true,
      message: "Admin registration successful",
    });

  } catch (err) {
    console.log("Error in admin registration", err);
    if (userType === "agent") {
      return res.status(500).send({
        status: false,
        message: "Agent registration failed",
        error: err
      });
    } else {
      return res.status(500).send({
        status: false,
        message: "Admin registration failed",
      });
    }
  }
}

// async function adminLogin(req, res) {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   });

//   try {
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).send({
//         status: false,
//         message: error.details[0].message,
//       });
//     }

//     const { email, password } = value;

//     // Find admin by email
//     const admin = await Admin.findOne({ email });

//     if (!admin) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid credentials!",
//       });
//     }

//     // Compare passwords
//     const validPassword = await bcrypt.compare(password, admin.password);

//     if (!validPassword) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid credentials!",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: admin.admin_user_id, userType: admin.userType },
//       JWT_SECRET_KEY,
//       { expiresIn: '100d' }
//     );

//     return res.status(200).send({
//       status: true,
//       message: "Admin login successful",
//       token,
//     });
//   } catch (error) {
//     console.error("Error during admin login:", error);
//     return res.status(500).send({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// }


async function sendLoginOTP(email, otp) {
  try {

    const imagePath = path.resolve(__dirname, '../public/logo.jpeg')
    // const images = fs.readFileSync(imagePath)

    // const base64Image = Buffer.from(images).toString('base64')
    // console.log(base64Image);
    // Path to your HTML file
    const templatePath = path.resolve(__dirname, '../template/emailTemplate/login.html');
    // Read the template file
    let html = fs.readFileSync(templatePath, 'utf8');
    // Replace placeholders with actual values
    html = html.replace('[OTP_Code]', otp);


    // const memberName = await TemporaryAdminOTP.findOne(admin_name);
    // console.log(memberName)
    // // Replace 'edgar' with  if memberName is defined
    // if (memberName) {
    //   html = html.replace('[edgar]', memberName.registrationData.admin_name);
    // }
    // Replace the <img> src attribute with base64 encoded image
    // html = html.replace('src="../public/logo.png"', `src="https://yuvabitcoin.com/images/yuvalogo.png"`);



    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // Set to true for a secure connection
      auth: {
        user: 'no-reply@yuvabitcoin.com', // Your Gmail email address
        pass: 'Yuvabitcoin@1234' // Your Gmail password
      }
    });

    const mailOptions = {
      from: 'no-reply@yuvabitcoin.com',
      to: email,
      subject: 'OTP Verification',
      // text: `Your OTP for registration is: ${otp}`
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully.', email, otp);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP.');
  }
}


async function adminLogin(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // check user_type if it is agent . if it is agent then check isActive is true then procced further
    if (value.userType === "agent") {
      if (value.isActive === false) {
        return res.status(400).send({
          status: false,
          message: "Agent is not active",
        });
      }
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).send({
        status: false,
        message: "Invalid credentials!",
      });
    }
    const validPassword = await bcrypt.compare(password, admin.password);

    console.log(validPassword)

    if (!validPassword) {
      return res.status(400).send({
        status: false,
        message: "Invalid password!",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Check if data already exists in TemporaryAdminOTP collection
    const existingData = await TemporaryAdminOTP.findOne({ email });

    if (existingData) {
      // Update existing data if found
      existingData.otp = otp;
      existingData.expiry = new Date(Date.now() + 2 * 60 * 1000); // expire in 2 minutes
      await existingData.save();
    } else {
      // Save OTP to temporary collection if not found
      const newData = await TemporaryAdminOTP.create({
        email,
        otp,
        expiry: new Date(Date.now() + 2 * 60 * 1000), // expire in 2 minutes
      });

      // start a job to remove expired data after 2 minutes
      setTimeout(async () => {
        await TemporaryAdminOTP.findOneAndDelete({
          email,
          expiry: { $lt: new Date() },
        });
      }, 2 * 60 * 1000);
    }

    // Send OTP via email
    await sendLoginOTP(email, otp);
    console.log("Login OTP is :", otp);

    return res.status(200).send({
      status: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
}


// Verify OTP Controller
async function verifyOTPAdmin(req, res) {
  const { otp: otpFromBody, email } = req.body; // Extract OTP and email from request body

  try {

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send({
        status: false,
        message: "Invalid email"
      })
    }

    if (!otpFromBody || !email) { // Check if OTP or email is missing
      return res.status(400).json({
        status: false,
        message: "OTP and email are required"
      });
    }

    // Find temporary OTP by email
    const temporaryOTP = await TemporaryAdminOTP.findOne({ email, otp: otpFromBody });

    if (!temporaryOTP) {
      return res.status(400).send({
        status: false,
        message: "Invalid OTP or email"
      });
    }

    // Delete temporary OTP
    await temporaryOTP.deleteOne();

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin.admin_user_id, userType: admin.userType }, // You can use any identifier here
      process.env.JWT_SECRET_KEY,
      { expiresIn: '100d' }
    );
    console.log("Token is :", admin.admin_user_id);
    return res.status(200).send({
      status: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (err) {
    console.log("Error in OTP verification", err);
    return res.status(400).send({
      status: false,
      message: "OTP verification failed"
    });
  }
}



const getAllAgent = async (req, res) => {
  try {

    const user = req.user;
    console.log("user", user);
    if (user.userType !== 'admin') {
      return res.status(400).json({ status: false, message: 'Unauthorized access' });
    }
    const agents = await Admin.find({ userType: 'agent' });
    return res.status(200).json({ status: true, data: agents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
}


const OTP_EXPIRY_TIME = 5 * 60 * 1000;
async function forgotPassword(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    // newPassword: Joi.string().min(6).required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    const { email, newPassword } = value;

    // Check if the user exists
    const user = await Member.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid email!",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP and email in temporary storage
    // const temporaryData = new TemporaryPasswordReset({
    //   email,
    //   otp,
    //   expiry: new Date(Date.now() + OTP_EXPIRY_TIME), // Define OTP_EXPIRY_TIME
    // });
    // Check if there's existing temporary password reset data for the email
    let temporaryData = await TemporaryPasswordReset.findOne({ email });

    if (temporaryData) {
      // Update existing temporary data with new OTP and reset expiry time
      temporaryData.otp = otp;
      temporaryData.expiry = new Date(Date.now() + OTP_EXPIRY_TIME);
    } else {
      // Save OTP and email in temporary storage
      temporaryData = new TemporaryPasswordReset({
        email,
        otp,
        expiry: new Date(Date.now() + OTP_EXPIRY_TIME),
      });
    }
    await temporaryData.save();

    // Send OTP to user via email or SMS (not implemented in this example)
    await sendOTPForgotPassword(email, otp);

    return res.status(200).send({
      status: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
}

async function verifyOTPForResetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Email, OTP, and new password are required"
      });
    }

    // Find temporary password reset data by email and OTP
    const temporaryPasswordResetData = await TemporaryPasswordReset.findOne({ email, otp });

    if (!temporaryPasswordResetData) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or OTP"
      });
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > temporaryPasswordResetData.expiry) {
      // If expired, remove the temporary data and inform the user
      await temporaryPasswordResetData.deleteOne();
      return res.status(400).json({
        status: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await Member.updateOne({ email }, { password: hashedPassword });

    // Delete temporary data
    await temporaryPasswordResetData.deleteOne();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Error during OTP verification for password reset:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}




async function changePassword(req, res) {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmNewPassword: Joi.string().min(6).required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    const { currentPassword, newPassword, confirmNewPassword } = value;

    // Check if new password and confirm new password are the same
    if (newPassword === currentPassword) {
      return res.status(400).send({
        status: false,
        message: "New password cannot be the same as the current password",
      });
    }

    // Check if new password matches confirm new password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send({
        status: false,
        message: "New password and confirm new password do not match",
      });
    }

    const userId = req.user.member_user_id;

    if (!userId) {
      return res.status(400).send({
        status: false,
        message: "User not found"
      });
    }

    // Find user by userId
    const user = await Member.findOne({ member_user_id: userId });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid User !",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({
        status: false,
        message: "Current password is incorrect",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error during password change:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
}


const deleteAgent = async (req, res) => {
  try {
    const user = req.user
    if (user.userType !== 'admin') {
      return res.status(400).send({
        status: false,
        message: "Only admin can delete agent"
      })
    }
    const { admin_user_id } = req.body

    const agentId = await Admin.findOneAndDelete({ admin_user_id: admin_user_id })
    //ad=gentId has usetType must be agent
    if (agentId.userType !== 'agent') {
      return res.status(400).send({
        status: false,
        message: "Agent not found"
      })
    }
    if (!agentId) {
      return res.status(400).send({
        status: false,
        message: "Agent not found"
      })
    }
    return res.status(200).send({
      status: true,
      message: "Agent deleted successfully",
      data: agentId
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: false,
      message: "Internal server error"
    })
  }
}


async function forgotPasswordAdmin(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    // newPassword: Joi.string().min(6).required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    const { email, newPassword } = value;

    // Check if the user exists
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid email!",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP and email in temporary storage
    // const temporaryData = new TemporaryPasswordReset({
    //   email,
    //   otp,
    //   expiry: new Date(Date.now() + OTP_EXPIRY_TIME), // Define OTP_EXPIRY_TIME
    // });
    // Check if there's existing temporary password reset data for the email
    let temporaryData = await TemporaryPasswordReset.findOne({ email });

    if (temporaryData) {
      // Update existing temporary data with new OTP and reset expiry time
      temporaryData.otp = otp;
      temporaryData.expiry = new Date(Date.now() + OTP_EXPIRY_TIME);
    } else {
      // Save OTP and email in temporary storage
      temporaryData = new TemporaryPasswordReset({
        email,
        otp,
        expiry: new Date(Date.now() + OTP_EXPIRY_TIME),
      });
    }
    await temporaryData.save();

    // Send OTP to user via email or SMS (not implemented in this example)
    await sendOTPForgotPassword(email, otp);
    return res.status(200).send({
      status: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
}

async function verifyOTPForResetPasswordAdmin(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Email, OTP, and new password are required"
      });
    }

    // Find temporary password reset data by email and OTP
    const temporaryPasswordResetData = await TemporaryPasswordReset.findOne({ email, otp });

    if (!temporaryPasswordResetData) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or OTP"
      });
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > temporaryPasswordResetData.expiry) {
      // If expired, remove the temporary data and inform the user
      await temporaryPasswordResetData.deleteOne();
      return res.status(400).json({
        status: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await Admin.updateOne({ email }, { password: hashedPassword });

    // Delete temporary data
    await temporaryPasswordResetData.deleteOne();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Error during OTP verification for password reset:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
}



module.exports = {
  register,
  login,
  getRegister,
  adminRegister,
  adminLogin,
  verifyOTP,
  forgotPassword,
  verifyOTPForResetPassword,
  changePassword,
  verifyOTPAdmin,
  getAllAgent, deleteAgent,
  forgotPasswordAdmin,
  verifyOTPForResetPasswordAdmin
};
