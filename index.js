var fs = require('fs');
var router = require('koa-route');
var koa = require('koa');
var app = koa();

var response = {
    status: 200,
    suggestions: {
        first: 'first suggestion',
        second: 'second suggestion'
    }
};

var request = function *() {
    this.body = {
        response: response
    }
};

var readFileThunk = function(src) {
    return new Promise(function (resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
            if(err) return reject(err);
            resolve(data);
        });
    });
}
console.log(__dirname);
app.use(router.get('/', function *(){
    this.body = yield readFileThunk(__dirname + '/example/index.html');
}));

app.use(router.post('/response', request));

app.listen(5123);
console.log('listening on port 5123');