var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const helmet = require('helmet');

const cors = require('cors')

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: false
}))
app.options('*', cors());

// Configure helmet with CSP for Firebase FCM
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
      connectSrc: [
        "'self'", 
        "https://fcm.googleapis.com", 
        "https://firebase.googleapis.com", 
        "https://firebaseinstallations.googleapis.com",
        "https://fcmregistrations.googleapis.com",
        "https://firebaseremoteconfig.googleapis.com",
        "https://*.googleapis.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware for static files
const corsStaticMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  next();
};

// Static files with CORS headers
app.use('/images', corsStaticMiddleware, express.static('public/assets'));

app.use('/', require('./routes/index'));

// Initialize GPS cron job scheduler
const cronJobService = require('./services/cronJobService');
console.log('[APP] Initializing GPS cron job scheduler...');
cronJobService.startScheduler();

// app.get('/api/images/:imageName', (req, res) => {
//    const imageName = req.params.imageName;
//    const imagePath = `public/${imageName}`;

//    // Menggunakan res.sendFile() untuk mengirimkan gambar
//    res.sendFile(imagePath, { root: __dirname });
// });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.status(404).send({
    status: {
      code: 404,
      message: 'Not Found'
    }
  })
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error', {
//     title: 'elogs internal API',
//     message: err.message,
//     error: err
//   });
// });

// error handler (for API)
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: {
      code: err.status || 500,
      message: err.message || 'Internal Server Error'
    },
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


var multer = require('multer');
var upload = multer();

app.use(upload.array());


module.exports = app;
