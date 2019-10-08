const cacheDao = require('../persistance/dao/cacheDao');

async function getFromCache(user) {
    const userCache = await cacheDao.findCacheByUser(user.toLowerCase());

    if (userCache) {
        const date = new Date(userCache.epoch);

        if (date <= Date.now()) {
            console.log(userCache.user + " expires NOW!");
            await cacheDao.deleteCacheByUser(userCache.user);
            return null;
        }

        return userCache;
    }
    
    return null;
}

async function pushToCache(user, subreddits) {
    user = user.toLowerCase();
    var date = new Date();
    date.setDate(date.getDate() + 3);
    const conn = await pool.getConnection();
    conn.query("INSERT INTO cache (`user`, `subreddits`, `epoch`) VALUES (?, ?, ?)", [user, JSON.stringify(subreddits), date.toUTCString()]);
    conn.end();
}

module.exports = {
    dumpCache: dumpCache,
    pushToCache: pushToCache,
    getFromCache: getFromCache
};