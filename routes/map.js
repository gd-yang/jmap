module.exports = function (app) {
    app.get('/map/mapabc.html', function (req, res) {
        res.render('./map/mapabc.html');
    });

    app.get('/map/sorting.html', function (req, res) {
        res.render('./map/sorting.html');
    });

    app.get('/map/sorting-old.html', function (req, res) {
        res.render('./map/sorting-old.html');
    });

    app.get('/map/demo.html', function (req, res) {
        res.render('./map/demo.html');
    });
}