module.exports = function (app) {
    app.get('/map/demo.html', function (req, res) {
        res.render('./map/demo.html');
    });

    app.get('/map/layers.html', function (req, res) {
        res.render('./map/layers.html');
    });

    app.get('/map/control.html', function (req, res) {
        res.render('./map/control.html');
    });

    app.get('/map/cmarker.html', function (req, res) {
        res.render('./map/cmarker.html');
    });

    app.get('/map/fgroup.html', function (req, res) {
        res.render('./map/fgroup.html');
    });

    app.get('/map/draw.html', function (req, res) {
        res.render('./map/draw.html');
    });

    app.get('/map/basic.html', function (req, res) {
        res.render('./map/basic.html');
    });

    app.get('/map/customlayer.html', function (req, res) {
        res.render('./map/customlayer.html');
    });

    app.get('/map/mapabc.html', function (req, res) {
        res.render('./map/mapabc.html');
    });
}