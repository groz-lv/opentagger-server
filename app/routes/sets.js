module.exports = async (req, res) => {
    res.type('application/json');
    res.send(JSON.stringify(sets));
}