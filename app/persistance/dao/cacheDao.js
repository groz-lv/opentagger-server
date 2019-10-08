const db = require('../connection');

const cacheModel = db.import('../models/cache');

async function findCacheByUser(user){
    return cacheModel.findOne({
        where: {
            user,
        },
        raw: true,
    });
}

async function createCache(cache){
    return cacheModel.create({
        cache,
    });
}

async function deleteCacheByUser(user){
    return cacheModel.destroy({
        where: {
            user,
        },
    });
}

module.exports = {
    findCacheByUser,
    createCache,
    deleteCacheByUser,
};