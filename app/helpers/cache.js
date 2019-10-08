const cacheDao = require('../persistance/dao/cacheDao');

async function getFromCache(user) {
    const userCache = await cacheDao.findCacheByUser(user.toLowerCase());

    if (userCache) {
        const date = new Date(userCache.epoch);

        if (date <= Date.now()) {
            console.log(`${userCache.user} expires NOW!`);
            await cacheDao.deleteCacheByUser(userCache.user);
            return null;
        }

        return userCache;
    }

    return null;
}

async function pushToCache(user, subreddits) {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    await cacheDao.createCache({
        user: user.toLowerCase(),
        subreddits: JSON.stringify(subreddits),
        epoch: date.toUTCString(),
    });
}

module.exports = {
    dumpCache: dumpCache,
    pushToCache: pushToCache,
    getFromCache: getFromCache
};