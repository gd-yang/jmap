module.exports = function (app) {
    app.get('/map/mapabc.html', function (req, res) {
        res.render('./map/mapabc.html');
    });

    app.get('/map/sorting.html', function (req, res) {
        res.render('./map/sorting.html');
    });
}