require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const port = process.env.PORT || 3008;

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const db = require('./database/models');
const email = require('./email/email');
const sms = require('./SMS/sms');

const init = async () => {
    await db.eventModel.sync({ force: false });
    await db.parentModel.sync({ force: false });
    await db.childModel.sync({ force: false });
    await db.eventparentModel.sync({ force: false });
    console.log('Tables Have Synced');
}

init();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('*.js', (req, res, next) => {
    req.url += '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

app.get('/getEventData', async (req, res) => {
    try {
        const getData = await db.eventModel.findOne({
            order: [
                ['id', 'DESC'],
            ],
        });
        res.status(200).send(JSON.stringify(getData));
    } catch (err) {
        res.status(404).send(err);
    }
});

app.post('/charge', bodyParser.text(), async (req, res) => {
    const { totalCost, token, data } = JSON.parse(req.body);
    const convertedCost = totalCost * 100;
    
    await stripe.charges.create({
        amount: convertedCost,
        currency: "usd",
        description: "Standard Charge for Slime Class",
        source: token,
        statement_descriptor: 'Slime Time Class',
    })
    .then(
        async function(result) {
            res.json({result});
            await email.sendEmails(data);
            await sms.sendSMS(data);
        },
        function(err) {
            console.log(err.statusCode);
            console.log(err.message);
            res.status(err.statusCode).json({err});
        }
    );
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log(`The server is listening on Port ${port}`)
});





// Note: Node.js API does not throw exceptions, and instead prefers the
// asynchronous style of error handling described below.
//
// An error from the Stripe API or an otheriwse asynchronous error
// will be available as the first argument of any Stripe method's callback:
// E.g. stripe.customers.create({...}, function(err, result) {});
//
// Or in the form of a rejected promise.
// E.g. stripe.customers.create({...}).then(
//        function(result) {},
//        function(err) {}
//      );

