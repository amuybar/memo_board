const express = require('express');
const session = require('express-session');
const path = require('path');
const sequalize = require('./database');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const memoRouter = require('./routes/memo');
const passport=require('passport');
const flash = require('express-flash');

const app = express();

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public', { setHeaders: res => res.set('Content-Type', 'application/javascript') }));

app.use(session({
    secret: 'sdfytekjhbvcadsrtku',
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false}
  }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', memoRouter);


// Sync the database
(async () => {
    try {
        await sequalize.sync();
        console.log('Database is ready');
        
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

module.exports = app;
