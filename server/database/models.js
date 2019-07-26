const Sequelize = require('sequelize');
const db = require('./index');

const eventModel = db.define('events', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    startdate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    enddate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    addressline2: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    city: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING(2),
        allowNull: false,
    },
    zipcode: {
        type: Sequelize.REAL,
        allowNull: false,
    },
    curr_children: {
        type: Sequelize.REAL,
        allowNull: false,
        default: 0,
    },
    max_children: {
        type: Sequelize.REAL,
        allowNull: false,
        default: 50,
    },
    totalcost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
    },
});

const eventparentModel = db.define('events_parents', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'parents',
            key: 'id',
        },
    }
});

const parentModel = db.define('parents', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

const childModel = db.define('children', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {   // child belongs to Parent 1:1
            model: 'parents',
            key: 'id',
        },
    },
});

parentModel.associate = function(models) {
    parentModel.hasMany(models.children, {as: 'child'});
};

childModel.associate = function(models) {
    childModel.belongsTo(models.parentModel, {foreignKey: 'parent_id', as: 'parent'})
}

parentModel.associate = function(models) {
    parentModel.hasMany(models.eventparentModel, {as: 'event'});
};

eventModel.associate = function(models) {
    eventModel.hasMany(models.eventparentModel, {as : 'parent'});
}

module.exports = {
    db,
    eventModel,
    parentModel,
    childModel,
    eventparentModel,
}