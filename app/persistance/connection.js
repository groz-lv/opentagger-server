const sequelize = require('sequelize');

module.exports = new sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        port: process.env.DB_PORT || 3306,

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },

        define: {
            timestamps: false,
        },
    }
);