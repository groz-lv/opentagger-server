const cache = require('../helpers/cache')

module.exports = async (req, res) => {
    var user = req.params.user;
    if (user != null) {
        var output = {};
        output['username'] = user.toLowerCase();
        const cached = await cache.getFromCache(user);
        if (cached != null) {
            console.log("Using cache for " + user + "!");
            output['subreddits'] = JSON.parse(cached.subreddits);
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
            cache.pushToCache(user, output['subreddits'])
        }
        res.type('application/json');
        res.send(JSON.stringify(output));
    }
} 