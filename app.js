
/**
 * Module dependencies.
 */
//requires
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

//variables
var numQue = 0;
var shreQue = 0;
var socketQueue = new Array();
var userQueue = new Array();

//definition of functions
Array.prototype.indexOf=function(element)
{
    for (i = 0; i < this.length; i++)
    {
        if (element==this[i])
            return i;
    }
    return -1;
}

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
app.get('/',function(req,res)
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
    numQue += 1;
    shreQue += 1;
    socketQueue.push(socket); //TEST
    socket.emit('news', { 'hello': numQue });
    socket.on('webBegin',function(data){
            console.log("[Status]"+ data.username + " " + shreQue + " logged in.");
            console.log("[Status]Have " + numQue + " Connection");
            userQueue.push(data.username + " "+ shreQue);
            for(var i=0 ; i<numQue ; i++)
                socketQueue[i].emit("someoneJoin",{'username':data.username + " "+ shreQue});
        }
    );
    socket.on('gotData', function (data) {
        //TEST
        for(var i=0;i<numQue;i++){
            sentEcho(data,socketQueue[i]);
            console.log("[ Data ]" + "X: " + data.x + ", Y: " + data.y + " " + data.isContinuous);
        }
    });
    socket.on('disconnect',function(){
        var toDel = socketQueue.indexOf(this);
        if(toDel != -1){
            console.log("[Status]"+ userQueue[toDel]  +" logged off." );
            for(var i=0 ; i<numQue ; i++)
                socketQueue[i].emit("someoneLeft",{'username':userQueue[toDel]});
            socketQueue.splice(toDel,1);
            userQueue.splice(toDel,1);
            --numQue;
            console.log("[Status]" + numQue + " connections in group." );
            if(numQue==0) shreQue=0;
        }
    });
    socket.on('cleanBoard',function(){
        console.log('Clean the white board.');
        for(var i=0 ; i<numQue ; i++)
            socketQueue[i].emit('cleanBoard');
    });
    }
);
