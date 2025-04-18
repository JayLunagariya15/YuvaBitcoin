const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');


const { Connection } = require("./config/db.config");
require("dotenv").config();

const cron = require('./crons/passiveincome');

const port = process.env.PORT || 5001;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// const db = require('./config/db.config.js');

app.use('/admin', require('./routes/Admin.route'));
app.use('/api/Advertiser', require('./routes/Advertiser.route'));
app.use('/api/Auth', require('./routes/Auth.route'));
app.use('/api/Blog', require('./routes/Blog.route'));
app.use('/api/Coin', require('./routes/Coin.route'));
app.use('/api/Dashboard', require('./routes/Dashboard.route'));
app.use('/api/Staking', require('./routes/Staking.route'));
app.use('/api/Deposit', require('./routes/deposit.route'));
app.use('/api/Team', require('./routes/Team.route'));
app.use('/api/Earning', require('./routes/Earning.route'));
app.use('/api/Withdraw', require('./routes/Withdraw.route'));
app.use('/api/Order', require('./routes/Order.route'));
app.use('/api/Support', require('./routes/Support.route'));
app.use('/api/Dummy', require('./routes/Dummy.route'));
app.use('/api/Referral', require('./routes/Referral.route'));
app.use('/api/ExternalSwap', require('./routes/ExternalSwap.route'));
app.use('/api/Permission', require('./routes/Permission.route'));
// Create an API endpoint to manually trigger the cron job



// app.listen(port, () => {
//     console.log(`Server is running on port ${port}.`);
// });


// app.post('/users', userController.addUser);

// app.post('/tasks', taskController.addTask);


// User routes
// app.get('/users/:userId', userController.getUserById);

// Task routes
// app.get('/tasks', taskController.getAllTasks);

// AssignedTask routes
// app.post('/assign-task', assignedTaskController.assignTask);
// app.post('/mark-task-completed/:assignedTaskId', assignedTaskController.markTaskCompleted);
// app.post('/confirm-task-completion/:assignedTaskId', assignedTaskController.confirmTaskCompletion);



//twitter routes
// app.post('/post-tweet', assignedTaskController.postTweet);

// app.get('/user-info', assignedTaskController.getUserInfo);

// app.delete('/delete-tweet/:tweetId', assignedTaskController.deleteTweet);


// app.get('/', (req, res) => {
//   const ipAddress = req.socket.remoteAddress;
//   res.send(`Your IP address is: ${ipAddress}`);
// });


//Database
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
Connection(username, password);

//listening
app.listen(port, (req, res) => {
  console.log("=== Server is Listening on " + port + " Port ===");
});

