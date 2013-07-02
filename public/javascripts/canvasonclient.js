//vars
var canvas1=document.getElementById('canvas1');
var context1=canvas1.getContext('2d');
var readytoDraw = false;
var userName = "New User";
var canvasX = new Array();
var canvasY = new Array();
var canvasID = new Array();
var idQueue = new Array();
var trackQueue = new Array();
var myID = 0;
var isContinuous = new Array();
var track = {};
//socket.io
var socket = io.connect('http://localhost');
socket.on('news', function (data){
    socket.emit('webBegin',{'username':userName});
});
socket.on('echo', function (data){
    pushPoints(data.x,data.y,data.isContinuous,data.ID);
    draw(context1,canvasX,canvasY,isContinuous,canvasID,trackQueue);
});
socket.on('someoneJoin', function (data){
    updateInformation(data.username + " joined us.");
});
socket.on('someoneLeft', function (data){
    updateInformation(data.username + " left.");
    garbageCollect(data.ID);
});
socket.on('cleanBoard', function (){
    updateInformation("Whiteboard got cleaned.");
    cleanBoard();
});
socket.on('someoneID', function (data){
    if(myID == 0 && (!data.isHistory)){
        myID = data.ID;
    }
    idQueue.push(data);
    var newTrack = {};
    newTrack.id = data.ID;
    trackQueue.push(newTrack);
});

//canvas events
//context,xArray,yArray,isContinuous,track
canvas1.onmousedown = function(e){
    readytoDraw = true;
    sentData(e.pageX-this.offsetLeft, e.pageY-this.offsetTop,false);
};
canvas1.onmousemove = function(e){
    if(readytoDraw){
        sentData(e.pageX-this.offsetLeft, e.pageY-this.offsetTop,true);
    }
};
canvas1.onmouseup = function(){
    readytoDraw = false;
};
canvas1.onmouseout = function(){
    readytoDraw = false;
};
function pushPoints(x,y,con,id){
    canvasX.push(x);
    canvasY.push(y);
    canvasID.push(id);
    isContinuous.push(con);
}
function draw(context,xArray,yArray,con,ids,tracks){
    context.strokeStyle = '#000000';
    context.lineJoin = 'round';
    context.lineWidth = 3;
    while(xArray.length>0){
        var currentID = ids.pop();
        var track;
        for(var i = 0;i<tracks.length;++i){
            if(tracks[i].id == currentID){
                track=tracks[i];
                break;
            }
        }
        track.preX = track.x;
        track.preY = track.y;
        track.x = xArray.pop();
        track.y = yArray.pop();
        track.isContinuous = con.pop();
        context.beginPath();
        if(track.isContinuous){
            context.moveTo(track.preX,track.preY);
        }
        else{
            context.moveTo(track.x+1,track.y+1);
        }
        context.lineTo(track.x,track.y);
        context.closePath();
        context.stroke();
    }
}
function emitcleanBoard(){
    socket.emit('cleanBoard');
}
function cleanBoard(){
    var i=0;
    self.setInterval(function(){
        context1.clearRect(i,0,i+120,480);
        i+=48;
        if(i==720) self.clearInterval();
    },60);
}
function updateInformation(data){
    var content = new Array();
    content.push('<tr><td>' + data + '</td></tr>');
    document.getElementById('table').innerHTML = content.join('');
}
Array.prototype.indexOf=function(element){
    for (var i = 0; i < this.length; i++){
        if (element==this[i])
            return i;
    }
    return -1;
};
function sentData(CoorX,CoorY,isContinuous){
    socket.emit('gotData',{'x':CoorX, 'y':CoorY, 'isContinuous':isContinuous, 'ID':myID});
}
function garbageCollect(data){
    idQueue.splice(idQueue.indexOf(data),1)
}