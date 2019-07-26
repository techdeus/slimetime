const { db, childModel, parentModel, eventModel, eventparentModel } = require('./models');

const seed = async () => {
    try {
        await db.sync({ force: true });
        let i = 0;
        while (i < 1) {
            const newEvent = await eventModel.create({
                image: '/images/banner',
                name: 'slime time with the girls',
                description: 'Slime Time with the children. Register now!',
                startdate: new Date('Aug 10 2019 12:00'),
                enddate: new Date('Aug 10 2019 17:00'),
                address: 'San Francisco, CA',
                addressline2: 'null',
                city: 'San Francisco',
                state: 'CA',
                zipcode: '94115',
                curr_children: 0,
                max_children: 75,
                totalcost: 15.00,
            });
            console.log('Record added to Event Table');
            const newParent = await parentModel.create({
                name: 'Marlon Sullivan',
                email: 'sullivan.marlon@gmail.com',
                phonenumber: '4152009879',
            });
            console.log('Record added to Parent Table');
            const newChildren = await childModel.create({
                name: 'Armani Sullivan',
                age: 12,
                parent_id: 1,
            });
            console.log('Record added to Child Table');
            const newEventParent = await eventparentModel.create({
                event_id: 1,
                parent_id: 1,
            });
            console.log('Record added to Event-Parent Table');
            i += 1;
        }
    } catch (err) {
        console.log(err);
    }
    db.close();
}

seed();