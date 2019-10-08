module.exports = (sequelize, DataTypes) => sequelize.define(
    'cache',
    {
        user: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
            field: 'user',
        },
        subreddits: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'subreddits',
        },
        epoch: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
            field: 'epoch',
        },
    },
    {
        tableName: 'cache',
    },
);
