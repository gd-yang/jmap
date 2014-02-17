module.exports = function (app) {
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