const cache = require('../helpers/cache');

module.exports = async (req, res) => {
    var user = req.params.user.toLowerCase();
    if (user != null) {
        var output = {};
        output['username'] = user;
        const cached = await cache.getFromCache(user);
        if (cached != null) {
            console.log("Using cache for " + user + "!");
            output['subreddits'] = JSON.parse(cached.subreddits);
        } else {
            console.log("Fetching "  + user);
            const overview = await reddit.getUser(user).getOverview().fetchAll();
            output['subreddits'] = {};
            overview.forEach(obj => {
                const sub = obj.subreddit.display_name.toLowerCase();
                if (all_subs.includes(sub)) {
                    if (output['subreddits'][sub] == null) {
                        output['subreddits'][sub] = {
                            karma: obj.score,
                            posts: 1,
                            category: sub_sets[sub]
                        };
                    } else {
                        output['subreddits'][sub].posts += 1;
                        output['subreddits'][sub].karma += obj.score;
                    }
                }
            });
            cache.dumpCache(user);
            cache.pushToCache(user, output['subreddits'])
        }
        res.type('application/json');
        res.send(JSON.stringify(output));
    }
} 