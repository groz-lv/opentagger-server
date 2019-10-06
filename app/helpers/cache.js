async function getFromCache(user) {
    user = user.toLowerCase();
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM cache WHERE user = ?', [user]);
    conn.end();
    if (rows[0] != null) {
        let date = new Date(rows[0].epoch);
        if (date <= Date.now()) {
            console.log(user + " expires NOW!");
            dumpCache(user);
            return null;
        }
        return rows[0];
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

async function dumpCache(user) {
    user = user.toLowerCase();
    const conn = await pool.getConnection();
    conn.query('DELETE FROM cache WHERE user = ?', [user]);
    conn.end();
}

module.exports = {
    dumpCache: dumpCache,
    pushToCache: pushToCache,
    getFromCache: getFromCache
};