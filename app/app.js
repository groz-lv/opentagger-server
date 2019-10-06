const YAML = require('yaml')
const fs = require('fs')
const express = require('express')
const snoowrap = require('snoowrap')
const mariadb = require('mariadb');
require('dotenv').config()

global.pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

global.reddit = new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
});
global.sets = YAML.parse(fs.readFileSync('sets.yml', { encoding: 'utf8' })).sets;
global.all_subs = [];
global.sub_sets = {}
const app = express();

for (var key in sets) {
    all_subs = all_subs.concat(sets[key])
    sets[key].forEach(sub => {
        sub_sets[sub.toLowerCase()] = key;
    });
}


app.get('/user/:user', require('./routes/user'));
app.get('/sets', require('./routes/sets'));
app.get('/info/:user', require('./routes/info'));

app.listen(process.env.PORT || 8080);
