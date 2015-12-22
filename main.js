var map = [
	"11111111111111111111111111111",
	"10000000000000000000000000001",
	"10000000000000000000000000001",
	"100F152F000000000000000000001",
	"10000000000000000000000000001",
	"10000000000000000000000000001",
	"100000000014F2100000000000001",
	"10000000000000000000000000001",
	"10000000000000001310000000001",
	"10000000000001101010000000001",
	"10000000000000111011000000001",
	"10000000000000000000000000001",
	"11111111111111111111111111111"
];

var colors = {
	"0": "lightgray",
	"1": "black",
	"2": "red",
	"3": "green",
	"4": "blue",
	"5": "yellow",
	"F": "white"
};

var x = 10;
var y = 10;
var angle = 0;
var linVelocity = 0.5;
var angVelocity = Math.PI/12;
var precision = 0.02;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function pickFieldOfView() {
	var w = canvas.width;
	if (w < 600) {
		return Math.PI/4;
	} else if (w < 800) {
		return Math.PI/3;
	} else if (w < 1000) {
		return Math.PI/2;
	} else {
		return 2*Math.PI/3;
	}
}


window.onkeydown = function(e) {
	console.log(e)
	if (e.keyCode == 38 || e.keyCode == 87) {
		// up
		var result = ray(0);
		var dx = linVelocity*Math.cos(angle);
		var dy = linVelocity*Math.sin(angle);
		if (result[0] <= Math.sqrt(dx*dx + dy*dy)) {
			return;
		}
		x += dx;
		y += dy;
	} else if (e.keyCode == 40 || e.keyCode == 83) {
		// down
		var result = ray(Math.PI);
		var dx = linVelocity*Math.cos(angle);
		var dy = linVelocity*Math.sin(angle);
		if (result[0] <= Math.sqrt(dx*dx + dy*dy)) {
			return;
		}
		x -= dx;
		y -= dy;
		
	} else if (e.keyCode == 39 || e.keyCode == 68) {
		// right
		angle = (angle + angVelocity) % (Math.PI * 2);
	} else if (e.keyCode == 37 || e.keyCode == 65) {
		// left
		angle = (angle - angVelocity) % (Math.PI * 2);
	}
	render();
};

function ray(theta) {
	var l = 0;
	var cx = x;
	var cy = y;
	while(map[Math.round(cy)][Math.round(cx)] == "0") {
		l += precision;
		cx = x + l*Math.cos(angle + theta);
		cy = y + l*Math.sin(angle + theta);
	}
	return [l, map[Math.round(cy)][Math.round(cx)]];
}

function render() {
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var mmW = winW/5;
	var mmH = winH/5;
	canvas.width = winW*0.75;
	canvas.height = winH*0.75;
	canvas.style.position = "absolute";
	canvas.style.left = winW*0.125 + "px";
	canvas.style.top = winH*0.125 + "px";
	
	var w = mmW;
	var h = mmH;
	var scalarW = w/map[0].length;
	var scalarH = h/map.length;
	
	
	/// Clear Rect
	
	var cW = canvas.width;
	var cH = canvas.height;
	
	ctx.fillStyle = "lightgray";
	ctx.fillRect(0, 0, cW, cH/2);
	ctx.fillStyle = "darkgray";
	ctx.fillRect(0, cH/2, cW, cH/2);
	
	
	/// Main Raytracer
	
	
	var fov = pickFieldOfView();
	for (var i = 0; i < cW; i += 1) {
		var theta = (fov)/cW*i - fov/2;
		var result = ray(theta);
		var distance = result[0];
		var color = colors[result[1]];
		ctx.fillStyle = color;
		var l = cH/distance;
		ctx.fillRect(i, cH/2 - l/2, 1, l);
	}
	
	/// Clear Minimap
	
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, mmW, mmH);
	ctx.strokeRect(0, 0, mmW, mmH);
	ctx.fillStyle = "black";
	
	/// Minimap
	
	
	var boxH = scalarH;
	var boxW = scalarW;
	
	for (var iX = 0; iX < map[0].length; iX++) {
		for (var iY = 0; iY < map.length; iY++) {
			ctx.fillStyle = colors[map[iY][iX]];
			ctx.fillRect(iX*boxW, iY*boxH, boxW, boxH);
		}
	}
	
	
	/// Player Icon
	var boxS = 3;
	ctx.fillRect(x*scalarW, y*scalarH, boxS, boxS);
	ctx.beginPath();
	ctx.moveTo(x*scalarW + boxS/2, y*scalarH + boxS/2);
	ctx.lineTo(x*scalarW + 5*Math.cos(angle) + boxS/2, y*scalarH + 5*Math.sin(angle) + boxS/2);
	ctx.stroke();
	
}

render();