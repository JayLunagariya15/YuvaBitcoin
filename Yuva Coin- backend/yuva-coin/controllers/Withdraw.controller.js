// controllers/withdrawController.js
const nodemailer = require('nodemailer');
const TemporaryWithdraw = require('../models/TemporaryWithdraw');
const Withdraw = require('../models/withdrawModel');
const Member = require('../models/memberModel');
const Coin = require('../models/Coin');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const Admin = require('../models/AdminModel');
const AdminControl = require('../models/AdminControl.Model')
const Permission = require('../models/permission.model');


//===================================================================================================
async function sendOTP(email, otp) {
  try {


    const imagePath = path.resolve(__dirname, '../public/logo.png')
    // const images = fs.readFileSync(imagePath)

    // const base64Image = Buffer.from(images).toString('base64')
    // Path to your HTML file
    const templatePath = path.resolve(__dirname, '../template/emailTemplate/withdraw.html');
    // Read the template file
    let html = fs.readFileSync(templatePath, 'utf8');
    // Replace placeholders with actual values
    html = html.replace('[OTP_Code]', otp);


    // const memberName = await TemporaryWithdraw.findOne({ email });
    // console.log(memberName)
    // // Replace 'edgar' with  if memberName is defined
    // if (memberName) {
    //   html = html.replace('[edgar]', memberName.email);
    // }
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
      // text: `Your OTP for Withdrawal Request is: ${otp}`
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully.', email, otp);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP.');
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}
//===================================================================================================
//===================================================================================================
// const withdrawRequest = async (req, res) => {
//   // Define a schema for request body validation
//   const schema = Joi.object({
//     amount: Joi.number().positive().required()
//   });


//   try {
//     const { member_user_id } = req.user;
//     // Validate the request body
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ status: false, message: error.details[0].message });
//     }

//     const { amount } = value;
//     // Check if the member exists
//     const member = await Member.findOne({ member_user_id });
//     if (!member) {
//       return res.status(400).json({
//         status: false,
//         message: 'No user found',
//       });
//     }

//     // Check if the withdrawal amount is greater than the available amount in the member's schema
//     if (amount > member.coins) {
//       return res.status(400).json({
//         status: false,
//         message: 'Withdrawal amount exceeds available balance',
//       });
//     }


//     // Generate a unique reference ID
//     const ref_id = generateReferenceID();

//     // Generate OTP
//     const otp = generateOTP();

//     const TemporaryWithdraw = new TemporaryWithdraw({
//       email: member.email,
//       otp,
//       withdrawData: {
//         amount,
//         ref_id
//       }
//     });
//     await TemporaryWithdraw.save();


//     // Send OTP to the member's email
//     await sendOTP(member.email, otp);

//     return res.status(200).json({
//       status: true,
//       message: 'OTP sent successfully to your email',
//       email: member.email,
//       amount: amount
//     });


//     // // Create a new withdrawal request
//     // const withdrawal = new Withdraw({
//     //   member_user_id,
//     //   member_name: member.member_name,
//     //   wallet_address: member.wallet_address,
//     //   with_amt: amount,
//     //   with_referrance: ref_id,
//     //   status: 'Pending', // Set the initial status to 'Pending'
//     // });

//     // // Save the withdrawal request
//     // await withdrawal.save();

//     // return res.status(200).json({
//     //   status: true,
//     //   message: 'Withdrawal request sent',
//     //   data: withdrawal,
//     // });
//   } catch (err) {
//     console.error('Error:', err);
//     return res.status(500).json({
//       status: false,
//       message: 'Internal Server Error',
//     });
//   }
// };
const withdrawRequest = async (req, res) => {
  // Define a schema for request body validation
  const schema = Joi.object({
    conversion_type: Joi.string().valid('usdt', 'yuva').required(),
    amount: Joi.number().positive().required()
  });

  try {
    const { member_user_id } = req.user;
    // Validate the request body
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ status: false, message: error.details[0].message });
    }

    const { amount, conversion_type } = value;
    // Check if the member exists
    const member = await Member.findOne({ member_user_id });
    if (!member) {
      return res.status(400).json({
        status: false,
        message: 'No user found',
      });
    }

    // Check if the withdrawal amount is greater than the available amount in the member's schema
    if (conversion_type === 'yuva') {
      if (amount > member.coins) {
        return res.status(400).json({
          status: false,
          message: 'Withdrawal amount exceeds available balance of YUVA',
        });
      }
    } else if (conversion_type === 'usdt') {
      if (amount > member.deposit_usdt) {
        return res.status(400).json({
          status: false,
          message: 'Withdrawal amount exceeds available balance of USDT',
        });
      }
    }

    const acontrol = await AdminControl.findOne({}, {}, { sort: { updatedAt: -1 } }).limit(1);

    if (conversion_type === 'yuva') {
      if (amount < acontrol.setMinimumWithdrawal) {
        return res.status(400).json({
          status: false,
          message: 'Minimum withdrawal amount is ' + acontrol.setMinimumWithdrawal,
        });
      }
      if (amount > acontrol.setMaximumWithdrawal) {
        return res.status(400).json({
          status: false,
          message: 'Maximum withdrawal amount is ' + acontrol.setMaximumWithdrawal,
        });
      }
    } else if (conversion_type === 'usdt') {
      if (amount < acontrol.setMinimumWithdrawalusdt) {
        return res.status(400).json({
          status: false,
          message: 'Minimum withdrawal amount is ' + acontrol.setMinimumWithdrawalusdt,
        });
      }
      if (amount > acontrol.setMaximumWithdrawalusdt) {
        return res.status(400).json({
          status: false,
          message: 'Maximum withdrawal amount is ' + acontrol.setMaximumWithdrawalusdt,
        });
      }
    }


    // Check if there's an existing temporary registration for the same email
    const existingTemporaryWithdrawal = await TemporaryWithdraw.findOne({ email: member.email });
    if (existingTemporaryWithdrawal) {
      // Generate new OTP
      const otp = generateOTP();
      // Generate a unique reference ID
      const ref_id = generateReferenceID();

      // Update existing temporary registration data
      existingTemporaryWithdrawal.ref_id = ref_id;
      existingTemporaryWithdrawal.otp = otp;
      existingTemporaryWithdrawal.conversion_type = conversion_type;
      existingTemporaryWithdrawal.temporaryWithdraw = {
        email: member.email,
        otp,
        withdrawData: {
          amount,
          conversion_type,
          ref_id
        }
      };
      await existingTemporaryWithdrawal.save();

      // Send OTP via email
      await sendOTP(member.email, otp);

      return res.status(200).send({
        status: true,
        message: "OTP sent to your email for verification",
        email: member.email,
      });
    }

    // Generate a unique reference ID
    const ref_id = generateReferenceID();

    // Generate OTP
    const otp = generateOTP();

    const temporaryWithdraw = new TemporaryWithdraw({
      email: member.email,
      otp,
      withdrawData: {
        amount,
        conversion_type,
        ref_id
      }
    });
    await temporaryWithdraw.save();

    // Send OTP to the member's email
    await sendOTP(member.email, otp);

    return res.status(200).json({
      status: true,
      message: 'OTP sent successfully to your email',
      email: member.email,
      amount: amount
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};


//Working OTP verification
async function verifyOTP(req, res) {
  const { otp: otpFromBody } = req.body; // Extract OTP from request body
  const { member_user_id } = req.user;
  try {
    if (!otpFromBody) { // Check if OTP is missing in the request body
      return res.status(400).json({
        status: false,
        message: "OTP is required"
      });
    }

    // Find temporary registration data by OTP from request body
    const temporaryWithdrawFromBody = await TemporaryWithdraw.findOne({ otp: otpFromBody });


    if (!temporaryWithdrawFromBody || !temporaryWithdrawFromBody.withdrawData) {
      return res.status(400).send({
        status: false,
        message: "Invalid OTP"
      });
    }

    // Extract amount from temporary registration data
    const { amount, conversion_type } = temporaryWithdrawFromBody.withdrawData;

    // Generate a unique reference ID
    const ref_id = generateReferenceID();
    const member = await Member.findOne({ member_user_id });
    if (!member) {
      return res.status(400).json({
        status: false,
        message: 'No user found',
      });
    }
    // Find member by email
    let existingWithdraw = await Withdraw.findOne({ amount });

    // If member exists, update the data, otherwise create a new member
    if (existingWithdraw) {
      // Update existing member data
      existingWithdraw.amount = amount;
      await existingWithdraw.save();
    } else {
      // Create new member instance using registration data
      const newWithdraw = new Withdraw({
        with_referrance: ref_id, // Required field
        with_amt: amount, // Required field
        conversion_type: conversion_type, // Required field
        wallet_address: member.wallet_address, // Example of a required field from member
        member_name: member.member_name, // Example of a required field from member
        member_user_id: member_user_id // Example of a required field from member
        // Add other necessary fields here
      });
      console.log("newWithdraw", newWithdraw);
      // Save the member to the database
      await newWithdraw.save();
    }
    // Delete temporary registration data
    await temporaryWithdrawFromBody.deleteOne();

    return res.status(200).send({
      status: true,
      message: "Withdrawal Request successful"
    });
  } catch (err) {
    console.log("Error in OTP verification", err);
    return res.status(400).send({
      status: false,
      message: "OTP verification failed"
    });
  }
}








async function getWithdrawByUserId(req, res) {
  try {
    // Extract member_user_id from request parameters
    const { with_referrance } = req.params;

    // Fetch the member from the database based on member_user_id
    const withdraw = await Withdraw.findOne({ with_referrance: with_referrance });

    // If the member is not found, return a 404 response
    if (!withdraw) {
      return res.status(404).json({
        status: false,
        message: `Member with user_id ${with_referrance} not found`,
        member: null,
      });
    }

    // Return the found member
    return res.status(200).json({
      status: true,
      message: `Member found with member_user_id ${with_referrance}`,
      withdraw: withdraw,
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


// Controller to update the status of a withdrawal request
// const updateWithdrawalStatus = async (req, res) => {
//   try {
//     const { with_referrance } = req.params;
//     const { status, processed_by, remarks } = req.body;

//     // Find the withdrawal request by reference ID
//     const withdrawal = await Withdraw.findOne({ with_referrance });

//     if (!withdrawal) {
//       return res.status(404).json({ error: 'Withdrawal request not found' });
//     }

//     // Check if the withdrawal request has already been processed
//     if (withdrawal.status !== 'Pending') {
//       return res.status(400).json({ error: `Withdrawal request has already been ${withdrawal.status.toLowerCase()}` });
//     }

//     // Update the withdrawal request status and other details
//     withdrawal.status = status;
//     withdrawal.processing_date = new Date().toISOString(); // Set the current date and time as the processing_date;
//     withdrawal.processed_by = processed_by;
//     withdrawal.remarks = remarks;

//     // Check if the status is "Approved" before deducting from member coins
//     if (status === 'Approved') {
//       // Find the member associated with the withdrawal request
//       const member = await Member.findOne({ member_user_id: withdrawal.member_user_id });

//       if (!member) {
//         return res.status(404).json({ error: 'Member not found' });
//       }

//       // Deduct the withdrawal amount from the member's coin balance
//       member.coins -= withdrawal.with_amt;
//       await member.save();
//     }

//     // Save the updated withdrawal request
//     const updatedWithdrawal = await withdrawal.save();

//     res.status(200).json(updatedWithdrawal);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


//==============above is working======================================
//======================below is testing code =============================
// const updateWithdrawalStatus = async (req, res) => {
//   try {
//     const { with_referrance } = req.params;
//     const { status, processed_by, remarks, conversion_type } = req.body;

//     // Find the withdrawal request by reference ID
//     const withdrawal = await Withdraw.findOne({ with_referrance });

//     if (!withdrawal) {
//       return res.status(404).json({ error: 'Withdrawal request not found' });
//     }

//     // Check if the withdrawal request has already been processed
//     if (withdrawal.status !== 'Pending') {
//       return res.status(400).json({ error: `Withdrawal request has already been ${withdrawal.status.toLowerCase()}` });
//     }

//     // Update the withdrawal request status and other details
//     withdrawal.status = status;
//     withdrawal.conversion_type = conversion_type;
//     withdrawal.processing_date = new Date().toISOString(); // Set the current date and time as the processing_date;
//     withdrawal.processed_by = processed_by;
//     withdrawal.remarks = remarks;

//     // Check if the status is "Approved" before deducting from member coins
//     if (status === 'Approved') {
//       // Fetch the Member model using member_user_id
//       const member = await Member.findOne({ member_user_id: withdrawal.member_user_id });

//       if (!member) {
//         return res.status(404).json({ error: 'Member not found' });
//       }

//       // Retrieve the current coin prices
//       const coinPrices = await Coin.findOne(); // Assuming there's only one document for coin prices

//       // Convert the withdrawal amount to the specified crypto (default to usdt)
//       let convertedAmount;
//       switch (withdrawal.conversion_type || 'usdt') {
//         case 'usdt':
//           convertedAmount = withdrawal.with_amt / coinPrices.price.usdt;
//           member.coins_usdt -= withdrawal.with_amt; // Deduct from usdt balance
//           break;
//         case 'bnb':
//           convertedAmount = withdrawal.with_amt / coinPrices.price.bnb;
//           member.coins_bnb -= withdrawal.with_amt; // Deduct from bnb balance
//           break;
//         case 'matic':
//           convertedAmount = withdrawal.with_amt / coinPrices.price.matic;
//           member.coins_matic -= withdrawal.with_amt; // Deduct from matic balance
//           break;
//         default:
//           return res.status(400).json({ error: 'Invalid conversion type' });
//       }

//       // Save the converted amount details to the Withdraw schema
//       withdrawal.converted_amount = convertedAmount;
//       withdrawal.conversion_date = new Date();
//       withdrawal.withdrawal_referrance = withdrawal.with_referrance;

//       // Save the updated withdrawal object to the database
//       await withdrawal.save();

//       // Save the updated member object to the database
//       await member.save();
//     }

//     res.status(200).json(withdrawal);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


const updateWithdrawalStatus = async (req, res) => {
  // Define a schema for request body validation
  const schema = Joi.object({
    status: Joi.string().valid('Approved', 'Rejected').required(),
    processed_by: Joi.string().required(),
    remarks: Joi.string().allow('').optional(),
    conversion_type: Joi.string().valid('usdt', 'bnb', 'matic', 'yuva').required(),
    transection_hash: Joi.string().allow('').optional()
  });
  try {

    const user = req.user.admin_user_id;
    const adminCheck = await Admin.findOne({ admin_user_id: user });

    if (!adminCheck) {
      return res.status(403).json({ error: 'Permission denied. You don\'t have the permission to update withdrawal approval.' });
    }

    if (adminCheck.userType === 'agent') {
      if (adminCheck.isActive === false) {
        return res.status(403).json({ error: 'Permission denied. Your account is deactivated.' });
      }
      const permission = await Permission.findOne({ admin_user_id: user })
      if (permission.setWithdrawalApprove === false) {
        return res.status(403).json({ error: 'Permission denied. You don\'t have the permission to update withdrawal approval.' });
      }
    }


    const { with_referrance } = req.params;
    const { status, processed_by, remarks, conversion_type, transection_hash } = req.body;

    // Validate the request body
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Find the withdrawal request by reference ID
    const withdrawal = await Withdraw.findOne({ with_referrance });

    if (!withdrawal) {
      return res.status(400).json({ error: 'Withdrawal request not found' });
    }

    if (withdrawal.conversion_type !== conversion_type) {
      return res.status(400).json({ error: 'Conversion type does not match' });
    }
    // Check if the withdrawal request has already been processed
    if (withdrawal.status !== 'Pending') {
      return res.status(400).json({ error: `Withdrawal request has already been ${withdrawal.status.toLowerCase()}` });
    }

    // Update the withdrawal request status and other details
    withdrawal.status = status;
    withdrawal.conversion_type = conversion_type;
    withdrawal.processing_date = new Date().toISOString(); // Set the current date and time as the processing_date;
    withdrawal.processed_by = processed_by;
    withdrawal.transection_hash = transection_hash;
    withdrawal.remarks = remarks;

    // Check if the status is "Approved" before deducting from member coins
    if (status === 'Approved') {
      // Fetch the Member model using member_user_id
      const member = await Member.findOne({ member_user_id: withdrawal.member_user_id });

      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      // Deduct the withdrawal amount from the member's coin balance based on the conversion_type
      if (conversion_type === 'yuva') {
        member.coins -= withdrawal.with_amt;
      } else if (conversion_type === 'usdt') {
        member.deposit_usdt -= withdrawal.with_amt;
      } else {
        return res.status(400).json({ error: 'Invalid conversion type' });
      }

      // Save the updated withdrawal object to the database
      await withdrawal.save();

      // Save the updated member object to the database
      await member.save();
    } else {
      // If the status is not "Approved", don't deduct from member's coins
      await withdrawal.save();
    }

    res.status(200).json(withdrawal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







const getWithdrawRequests = async (req, res) => {
  // const { member_user_id } = req.user;
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    // Fetch withdrawal requests for the current member
    // status 0 for pending
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    const withdrawRequests = await Withdraw.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    // Total number of withdrawal requests
    const totalWithdrawRequests = await Withdraw.countDocuments();

    if (!withdrawRequests || withdrawRequests.length === 0) {
      return res.status(200).json({
        status: false,
        message: 'No withdrawal requests',
        totalWithdrawRequests: totalWithdrawRequests,
        withdrawRequest: []
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Withdrawal requests',
      totalWithdrawRequests: totalWithdrawRequests,
      data: withdrawRequests,
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};
const getWithdrawPending = async (req, res) => {
  // const { member_user_id } = req.user;
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    // Fetch withdrawal requests for the current member
    // status 0 for pending
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    const withdrawRequests = await Withdraw.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    // Total number of pending withdrawal requests
    const totalPendingWithdrawRequests = await Withdraw.countDocuments({ status: 'Pending' });

    if (!withdrawRequests || withdrawRequests.length === 0) {
      return res.status(200).json({
        status: false,
        message: 'No withdrawal pending',
        totalPendingWithdrawRequests: totalPendingWithdrawRequests,
        withdrawRequest: [],
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Withdrawal Pending : ',
      totalPendingWithdrawRequests: totalPendingWithdrawRequests,
      data: withdrawRequests,
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};

const getWithdrawApproved = async (req, res) => {
  // const { member_user_id } = req.user;
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    // Fetch withdrawal requests for the current member
    // status 0 for pending
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    const withdrawRequests = await Withdraw.find({ status: 'Approved' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const totalApprovedWithdrawRequests = await Withdraw.countDocuments({ status: 'Approved' });

    if (!withdrawRequests || withdrawRequests.length === 0) {
      return res.status(200).json({
        status: false,
        message: 'No withdrawal Approved',
        totalApprovedWithdrawRequests: totalApprovedWithdrawRequests,
        withdrawRequests: []
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Withdrawal Approved : ',
      totalApprovedWithdrawRequests: totalApprovedWithdrawRequests,
      data: withdrawRequests,
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};


const getWithdrawRejected = async (req, res) => {
  // const { member_user_id } = req.user;
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    // Fetch withdrawal requests for the current member
    // status 0 for pending
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    const withdrawRequests = await Withdraw.find({ status: 'Rejected' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    const totalRejectedWithdrawRequests = await Withdraw.countDocuments({ status: 'Rejected' });
    if (!withdrawRequests || withdrawRequests.length === 0) {
      return res.status(200).json({
        status: false,
        message: 'No withdrawal Rejected',
        totalRejectedWithdrawRequests: totalRejectedWithdrawRequests,
        withdrawRequests: []
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Withdrawal rejected :',
      totalRejectedWithdrawRequests: totalRejectedWithdrawRequests,
      data: withdrawRequests,
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};

const getUserWithdraws = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  const { member_user_id } = req.user;

  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;
    // Fetch withdrawal requests for the current member
    const withdrawRequests = await Withdraw.find({ member_user_id })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    const totalUserWithdrawRequests = await Withdraw.countDocuments({ member_user_id });
    if (!withdrawRequests || withdrawRequests.length === 0) {
      return res.status(200).json({
        status: false,
        message: 'No User withdrawal requests',
        totalUserWithdrawRequests: totalUserWithdrawRequests,
        withdrawRequests: []
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Withdrawal requests',
      totalUserWithdrawRequests: totalUserWithdrawRequests,
      data: withdrawRequests,
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};


// Helper function to generate a reference ID
const generateReferenceID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref_id = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 20; i++) {
    ref_id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return ref_id;
};


const findMemberWithdraw = async (req, res) => {
  try {
    const { member_name } = req.body
    if (member_name.length < 3) {
      return res.status(400).json({ status: false, message: "Minimum 3 character required" });
    }
    const member = await Withdraw.find({ member_name: { $regex: member_name, $options: "i" } }).lean();
    // const member = await Withdraw.find({ member_name: { $regex: member_name, $options: "i" } });
    if (member.length == 0) {
      return res.status(404).json({ status: false, message: "Member not found" });
    }
    return res.status(200).json({ status: true, message: "Member found", data: member });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
}

module.exports = {
  withdrawRequest,
  updateWithdrawalStatus,
  getWithdrawRequests,
  getWithdrawApproved,
  getWithdrawRejected,
  getWithdrawPending,
  getUserWithdraws,
  getWithdrawByUserId,
  verifyOTP,
  findMemberWithdraw
};
