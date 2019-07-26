require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3008;
const hostName = '127.0.0.1';
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

app.listen(port, hostName, () => {
    console.log(`The server is listening on Port ${port}`)
});