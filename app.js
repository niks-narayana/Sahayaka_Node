var createError = require('http-errors');
var express = require('express'), bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var createTicketRouter = require('./routes/createTicket');
var getAllOpenTicketsRouter = require('./routes/getAllOpenTickets');
var getAllTicketsRouter = require('./routes/getAllTickets');
var akRouter = require('./routes/ak');
var getClosedTicketRouter = require('./routes/getClosedTicket');
var getPhoneNumberDetailsRouter = require('./routes/getPhoneNumberDetails');
var getPendingTicketRouter = require('./routes/pendingTicket');
var updateTicketRouter = require('./routes/updateTicket');

var app = express();
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* Define Routes Here Start */
app.use('/', indexRouter);
app.use('/createTicket', createTicketRouter);
app.use('/getAllOpenTickets', getAllOpenTicketsRouter);
app.use('/getAllTickets', getAllTicketsRouter);
app.use('/getClosedTicket', getClosedTicketRouter);
app.use('/getPhoneNumberDetails', getPhoneNumberDetailsRouter);
app.use('/pendingTicket', getPendingTicketRouter);
app.use('/ak', akRouter);
app.use('/updateTicket', updateTicketRouter);

/* Define Routes Here End */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
