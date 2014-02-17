module.exports = function (app) {
    require('./map')(app);
    require('./test')(app);
};