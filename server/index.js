require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3008;
const db = require('./database/models');

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

app.use('/', express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log(`The server is listening on Port ${port}`)
});