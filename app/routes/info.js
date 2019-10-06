const Sqrl = require('squirrelly');
const fs = require('fs');
const cache = require('../helpers/cache');

const template = fs.readFileSync('app/views/info.html', 'utf-8');

module.exports = async (req, res) => {
    var cached = await cache.getFromCache(req.params.user);
    var subreddits = cached == null ? {} : JSON.parse(cached.subreddits);
    res.type('text/html');
    res.send(
        Sqrl.Render(template, {
            subs: subreddits,
            available: cached != null,
            user: req.params.user
        })
    );
}