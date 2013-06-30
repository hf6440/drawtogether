
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/index',function(req,res)
    {
        res.render("index.html");
    }
);
app.get('/canvas',function(req,res)
    {
        res.render("canvas.html");
    }
);

var httpServer = http.createServer(app).listen(app.get('port'),
    function()
    {
        console.log('Express server listening on port ' + app.get('port'));
    }
);

//socket.io
console.log('start io');
var io = require('socket.io').listen(httpServer);
var sentEcho = function(data,socket)
{
    socket.emit('echo',{'x':data.x, 'y':data.y, 'isContinuous':data.isContinuous});
}
io.sockets.on('connection', function (socket) {
    console.log("[TEST]set up con");
    socket.emit('news', { hello: 'world' });
    socket.on('webBegin',function()
        {
            console.log("Connection began from Web");
        }
    );
    socket.on('gotData', function (data) {
        sentEcho(data,socket);
        console.log("X: " + data.x + ", Y: " + data.y + " " + data.isContinuous);
    });
}
);
