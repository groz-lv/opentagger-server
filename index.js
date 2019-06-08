const YAML = require('yaml')
const fs = require('fs')
const express = require('express')
const snoowrap = require('snoowrap')
const mariadb = require('mariadb');
require('dotenv').config()

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const reddit = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});
const app = express();
const sets = YAML.parse(fs.readFileSync('sets.yml', { encoding: 'utf8' })).sets;
var all_subs = [];

for (var key in sets) {
    all_subs = all_subs.concat(sets[key])
}

async function getFromCache(user) {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM cache WHERE user = ?', [user]);
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
    var date = new Date();
    date.setDate(date.getDate() + 3);
    const conn = await pool.getConnection();
    conn.query("INSERT INTO cache (`user`, `subreddits`, `epoch`) VALUES (?, ?, ?)", [user, JSON.stringify(subreddits), date.toUTCString()]);
}

async function dumpCache(user) {
    const conn = await pool.getConnection();
    conn.query('DELETE FROM cache WHERE user = ?', [user]);
}

app.get('/user/:user', async (req, res) => {
    var user = req.params.user;
    if (user != null) {
        var output = {};
        output['username'] = user.toLowerCase();
        const cache = await getFromCache(user);
        if (cache != null) {
            console.log("Using cache for " + user + "!");
            output['subreddits'] = JSON.parse(cache.subreddits);
        } else {
            const overview = await reddit.getUser(user).getOverview().fetchAll();
            output['subreddits'] = {};
            overview.forEach(obj => {
                const sub = obj.subreddit.display_name.toLowerCase();
                if (all_subs.includes(sub)) {
                    if (output['subreddits'][sub] == null) {
                        output['subreddits'][sub] = {
                            karma: obj.score,
                            posts: 1
                        };
                    } else {
                        output['subreddits'][sub].posts += 1;
                        output['subreddits'][sub].karma += obj.score;
                    }
                }
            });
            pushToCache(user, output['subreddits'])
        }
        res.type('application/json');
        res.send(JSON.stringify(output));
    }
});

app.get('/sets', async (req, res) => {
    res.type('application/json');
    res.send(JSON.stringify(sets));
});

app.listen(80);
