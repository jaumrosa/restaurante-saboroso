require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const formidable = require('formidable');
const http = require('http');
const socket = require('socket.io');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();

const server = http.createServer(app);
const io = socket(server);

io.on('connection', function(socket){
  console.log('Novo usuário detectado!')
});

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT)
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis conectado com sucesso!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'sess:',
    ttl: 86400
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next){
  if (req.method === 'POST'){
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      const form = new formidable.IncomingForm({
        uploadDir: path.join(__dirname, "/public/images"),
        keepExtensions: true,
        multiples: false,
        allowEmptyFiles: true,
        minFileSize: 0
      });
      
      form.parse(req, function(err, fields, files){
        if (err) {
          console.error('Erro no formidable:', err);
          return next(err);
        }
        
        for (let key in fields) {
          if (Array.isArray(fields[key])) {
            fields[key] = fields[key][0];
          }
        }
        
        for (let key in files) {
          if (Array.isArray(files[key])) {
            files[key] = files[key][0];
          }

          if (files[key] && (files[key].size === 0 || !files[key].originalFilename)) {
            delete files[key];
          }
        }
        
        req.fields = fields;
        req.files = files;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000, function(){
  console.log("Servidor em execução!")
});