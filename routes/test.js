module.exports = function (app) {
    app.get('/test/main.html', function (req, res) {
        res.render('./test/main.html');
    });

    app.get('/test/a.html', function (req, res) {
        res.render('./test/a.html');
    });

    app.get('/test/b.html', function (req, res) {
        res.render('./test/b.html');
    });

    app.get('/test/demo.html', function (req, res) {
        res.render('./test/demo.html');
    });

    app.get('/test/layers.html', function (req, res) {
        res.render('./test/layers.html');
    });

    app.get('/test/control.html', function (req, res) {
        res.render('./test/control.html');
    });

    app.get('/test/cmarker.html', function (req, res) {
        res.render('./test/cmarker.html');
    });

    app.get('/test/fgroup.html', function (req, res) {
        res.render('./test/fgroup.html');
    });

    app.get('/test/draw.html', function (req, res) {
        res.render('./test/draw.html');
    });

    app.get('/test/basic.html', function (req, res) {
        res.render('./test/basic.html');
    });

    app.get('/test/customlayer.html', function (req, res) {
        res.render('./test/customlayer.html');
    });
}