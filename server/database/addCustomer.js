const { eventModel, parentModel, childModel, eventparentModel } = require('./models');

async function addCustomer(data) {
    const parent = await parentModel.build({
        name: data.name,
        email: data.email,
        phonenumber: data.phonenumber,
    })
    .save()
    .then(result => {
        console.log('Parent Added: ' + result);
        data.values.forEach(async (child) => {
            const children = await childModel.build({
                name: child.name,
                age: parseInt(child.age),
                parent_id: result.id,
            })
            .save()
            .catch(err => console.log(err));
        });
        return result;
    })
    .then((parent) => {
        console.log('Children Added');
        const eventParent = eventparentModel.build({
            event_id: data.event.id,
            parent_id: parent.id,
        })
        .save()
        .catch(err => console.log(err));
    })
    .then(() => {
        console.log('Parent & Event Tied Together');
        eventModel.findByPk(parseInt(`${data.event.id}`))
            .then(event => {
                return event.increment('curr_children', {by: parseInt(`${data.values.length}`)})
            })
            .catch(err => console.log(err));
        console.log('Event Updated with Curr Children');
    })
    .catch(err => console.log(err));
};

module.exports = addCustomer;