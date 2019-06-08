const YAML = require('yaml')
const fs = require('fs')
const express = require('express')
const snoowrap = require('snoowrap')
require('dotenv').config()

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

app.get('/user/:user', async (req, res) => {
    var user = req.params.user;
    if (user != null) {
        const overview = await reddit.getUser(user).getOverview().fetchAll();
        var output = {};
        output['username'] = user.toLowerCase();
        output['subreddits'] = {};
        overview.forEach(obj => {
            const sub = obj.subreddit.display_name.toLowerCase();
            if(all_subs.includes(sub)) {
                if(output['subreddits'][sub] == null) {
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
        res.type('application/json');
        res.send(JSON.stringify(output));
    }
});

app.get('/sets', async (req, res) => {
    res.type('application/json');
    res.send(JSON.stringify(sets));
});

app.listen(80);