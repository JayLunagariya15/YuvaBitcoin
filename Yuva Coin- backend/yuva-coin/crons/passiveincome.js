// // Define an API endpoint to get interest rates for a specific staking duration

// require("dotenv").config();
// const mysql = require("mysql2");
// const { promisify } = require("util");
// const cron = require("node-cron");
// const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
// const connection = mysql.createConnection({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
// });

// try {
//   connection.connect((error) => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
//     // now we can start cron
//     task.start();
//   });
// } catch (error) {
//   console.log("error", error);
// }

// var task = cron.schedule("*/1 * * * * *", async () => {
//   console.log("passive income");
//   const query = promisify(connection.query).bind(connection);

//   const date = new Date();
//   const registration_date = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate(),
//     0,
//     0,
//     0,
//     0
//   );

//   console.log(registration_date);

//   // const sql2 = `SELECT * FROM tbl_memberreg WHERE registration_date < '${registration_date.toISOString()}' AND status=1 LIMIT 0,10`;
//   // const result2 = await query(sql2);
//   const sqlTesting = `SELECT * FROM tbl_memberreg WHERE status=1 LIMIT 0,10`;

//   const result2 = await query(sqlTesting);
//   console.log(result2.length);

//   result2.forEach(async function (row2) {
//     const member_user_id = row2.member_user_id;
//     const strM = `SELECT member_name FROM tbl_memberreg WHERE member_user_id='${member_user_id}'`;
//     const resultM = await query(strM);
//     console.log(resultM.length);
//     if (resultM.length == 0) {
//       return;
//     }
//     const member_name = resultM[0].member_name;
//     const invest_package = row2.invest_package;
//     const hash_code = row2.hash_code;
//     let roi_rate;

//     roi_rate = await findRoi(invest_package)
//     // if (invest_package <= 2500) {
//     //   roi_rate = 0.2;
//     // } else if (invest_package > 2500 && invest_package <= 20000) {
//     //   roi_rate = 0.27;
//     // } else if (invest_package > 20000) {
//     //   roi_rate = 0.33;
//     // }
//     const income_amt = (invest_package * roi_rate) / 100;
//     console.log(income_amt);
//     if (income_amt > 0) {
//       const str_in = `INSERT INTO tbl_member_income_dtails(member_user_id,member_name,calculate_date,income_amt,income_level,income_type,b_type,income_member_id,net_amt,hash_code,investment_amt,income_per) VALUES ('${member_user_id}','${member_name}','${date
//         .toISOString()
//         .slice(
//           0,
//           10
//         )}',${income_amt},1,'STAKING BONUS','STAKING BONUS','${member_user_id}',${income_amt},'${hash_code}','${invest_package}',${roi_rate})`;
//       await query(str_in);
//       const checkUp = `SELECT minting_wallet FROM tbl_memberreg WHERE member_user_id='${member_user_id}'`;
//       const resultUp = await query(checkUp);
//       if (resultUp.length === 0) {
//         console.log("Before - " + resultUp[0].minting_wallet);
//       }
//       console.log(income_amt);
//       const up = `UPDATE tbl_memberreg SET minting_wallet=minting_wallet+${income_amt} WHERE member_user_id='${member_user_id}'`;
//       await query(up);

//       const resultUp2 = await query(checkUp);
//       if (resultUp2.length === 0) {
//         console.log("Before - " + resultUp2[0].minting_wallet);
//       }
//     }
//   });
// });

// //checking amount range, how much times they get return
// function checkAmount(amount) {
//   switch (true) {
//     case amount >= 100 && amount < 24999:
//       return 2;
//     case amount >= 25000:
//       return 2.5;
//     default:
//       return 0;
//   }
// }

// //checking amount range, how much they get retrun daily
// function findRoi(amount) {
//   switch (true) {
//     case amount >= 100 && amount <= 4999:
//       return 0.5;
//     case amount >= 5000 && amount <= 9999:
//       return 0.75;
//     case amount >= 10000 && amount <= 24999:
//       return 1;
//     case amount >= 25000 && amount <= 49999:
//       return 1.25;
//     case amount >= 50000 && amount <= 99999:
//       return 1.5;
//     case amount >= 100000:
//       return 2;
//     default:
//       return 0;
//   }
// }




const cron = require('node-cron');
const Stake = require('../models/stake');
const StakeHistory = require('../models/stakingHistory');
const Member = require('../models/memberModel');
const { Task, CompletedTask } = require('../models/Task');
const AdminControl = require("../models/AdminControl.Model")

// Cron job to calculate interest
cron.schedule('0 0 */12 * *', async () => {
  console.log('Running the daily 1 cron job...');

  try {
    // Find staking Stakes with interest not credited
    const stakingStakes = await Stake.find({ interestCredited: false });

    // Iterate over staking Stakes and calculate interest
    for (const stake of stakingStakes) {
      const currentDate = new Date();
      const stakingStartDate = stake.sys_date;
      const stakingDuration = stake.stakingDuration;

      const elapsedTime = currentDate - stakingStartDate;
      const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

      // Check if the staking duration has been reached
      if (elapsedDays >= stakingDuration * 30) { // Assuming each month has 30 days
        const interestRate = await getInterestRate(stakingDuration);
        if (interestRate !== null) {
          // Calculate interest based on the original investment amount
          const interest = calculateInterest(stake.investment, interestRate, stakingDuration);

          // Update member's account with interest
          const member = await Member.findOne({ member_user_id: stake.member_user_id });
          member.coins += interest;
          await member.save();

          // Mark the stake as credited
          stake.interestCredited = true;
          await stake.save();

          //also update the stakeHistory table same to same sake.interestCredited = true
          const stakeHistory = await StakeHistory.findOneAndUpdate(
            { transaction_id: stake.transaction_id },
            { interestCredited: true },
            { new: true }
          );
          if (!stakeHistory) {
            console.error(`Error updating stakeHistory for stake with ID ${stake._id}.`);
          }
          console.log(`Staking duration reached for stake with ID ${stake._id}. Member received ${interest} coins as interest.`);
        } else {
          console.log(`Invalid staking duration for stake with ID ${stake._id}.`);
        }
      }
    }

    console.log('Daily cron job completed.');
  } catch (error) {
    console.error('Error in the daily cron job:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata', // Set your timezone to IST
});

// Helper function to calculate interest based on stake duration
// function calculateInterest(investment, interestRate, stakingDuration) {
//   const monthlyInterestRate = interestRate / 12; // Convert annual interest rate to monthly
//   return investment * monthlyInterestRate * stakingDuration; // Monthly interest for the stake duration
// }

// Helper function to calculate interest based on investment and interest rate
function calculateInterest(investment, interestRate) {
  // Convert annual interest rate to a decimal
  const annualInterestRate = interestRate / 100;
  // Calculate the interest amount
  const interest = investment * annualInterestRate;
  return interest;
}




async function getInterestRate(stakingDuration) {
  const acontrol = await AdminControl.findOne({}, {}, { sort: { updatedAt: -1 } }).limit(1);
  if (stakingDuration === acontrol.setStakeMonth1) {
    return acontrol.setStakePercent1; // 5% per annum
  } else if (stakingDuration === acontrol.setStakeMonth2) {
    return acontrol.setStakePercent2; // 7% per annum
  } else if (stakingDuration === acontrol.setStakeMonth3) {
    return acontrol.setStakePercent3; // 10% per annum
  }
  return null; // Invalid duration
}

// cron.schedule('*/1 * * * *', async () => {
//   console.log('Running the daily 1 cron job...');

//   try {
//     // Find staking Stakes with interest not credited
//     const stakingStakes = await Stake.find({ interestCredited: false });

//     // Iterate over staking Stakes and calculate interest
//     for (const stake of stakingStakes) {
//       const currentDate = new Date();
//       const stakingStartDate = stake.sys_date;
//       const stakingDuration = stake.stakingDuration;

//       const elapsedTime = currentDate - stakingStartDate;
//       const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

//       // Check if the staking duration has been reached
//       if (elapsedDays >= stakingDuration * 30) { // Assuming each month has 30 days
//         const interestRate = getInterestRate(stakingDuration);
//         if (interestRate !== null) {
//           // Calculate interest based on the original investment amount
//           const interest = calculateInterest(stake.investment, interestRate, stakingDuration);

//           // Update member's account with interest
//           const member = await Member.findOne({ member_user_id: stake.member_user_id });
//           member.coins += interest;
//           await member.save();

//           // Mark the stake as credited
//           stake.interestCredited = true;
//           await stake.save();

//           console.log(`Staking duration reached for stake with ID ${stake._id}. Member received ${interest} coins as interest.`);
//         } else {
//           console.log(`Invalid staking duration for stake with ID ${stake._id}.`);
//         }
//       }
//     }

//     console.log('Daily cron job completed.');
//   } catch (error) {
//     console.error('Error in the daily cron job:', error);
//   }
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata', // Set your timezone to IST
// });

// // Helper function to calculate interest based on stake duration
// function calculateInterest(investment, interestRate, stakingDuration) {
//   const monthlyInterestRate = interestRate / 12; // Convert annual interest rate to monthly
//   return investment * monthlyInterestRate * stakingDuration; // Monthly interest for the stake duration
// }

// async function getInterestRate(stakingDuration) {
//   const acontrol = await AdminControl.findOne({});
//   if (stakingDuration === acontrol.setStakeMonth1) {
//     return acontrol.setStakePercent1; // 5% per annum
//   } else if (stakingDuration === acontrol.setStakeMonth2) {
//     return acontrol.setStakePercent2; // 7% per annum
//   } else if (stakingDuration === acontrol.setStakeMonth3) {
//     return acontrol.setStakePercent3; // 10% per annum
//   }
//   return null; // Invalid duration
// }


// Helper function to get interest rate based on stake duration
// function getInterestRate(stakingDuration) {
//   if (stakingDuration === 3) {
//     return 0.05; // 5% per annum
//   } else if (stakingDuration === 6) {
//     return 0.07; // 7% per annum
//   } else if (stakingDuration === 12) {
//     return 0.10; // 10% per annum
//   }
//   return null; // Invalid duration
// }


module.exports = {
  cron
}