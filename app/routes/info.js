const Sqrl = require('squirrelly');
const fs = require('fs');
const cache = require('../helpers/cache');

const template = fs.readFileSync('app/views/info.html', 'utf-8');

module.exports = async (req, res) => {
    const { user } = req.params;

    const cached = await cache.getFromCache(user);
    const subreddits = cached == null ? {} : JSON.parse(cached.subreddits);
    res.type('text/html');
    res.send(
        Sqrl.Render(template, {
            subs: subreddits,
            available: cached != null,
            user,
        })
    );
}