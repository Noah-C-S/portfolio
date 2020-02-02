let scoreOne = 0;
let scoreTwo = 0;
let paddleW = 10; //width of the paddles
let paddleSpeed = 10; //speed at which the paddles move
let keysDown = []; //these are the keys that are being held right now. 
let id = 0;
let ballSize = 9;
let ballAngle = (Math.random() * 70 + 10 + (90 * Math.floor(Math.random()*4))); //the ball's angle, expressed in degrees.
let ballTimeOut = true;
let hBCoolDown = false; //makes sure that the angle changes only once per bounce. 
let vBCoolDown = false;
let paused = false;
let bindingUO = false;
let bindingDO = false;
let bindingUT = false;
let bindingDT = false;
document.addEventListener('DOMContentLoaded', function(){
	let size = 480; //Size of the playing field. Global variables are used for settings, which can be changed during runtime. 
	let paddleH = 50; //height of the paddles
	let controls = { //the current controls
		'upOne' : 'w',
		'downOne' : 's',
		'upTwo' : 'i',
		'downTwo' : 'k'
	};
	let ballSpeed = 8;
	let paddleOne = (size - paddleH)/2; //coordinates of the left paddle. All coordinates represent the upper left hand corner of all objects. 
	let paddleTwo = (size - paddleH)/2;
	let ballX = (size - ballSize)/2;
	let ballY = (size - ballSize)/2;
	const scoreJeden = document.getElementById("scoreOne"); //Jeden (pronounced yeden) means one in Polish, and I use it here so it doesn't conflict with the variable scoreOne.This also prevents a bug on safari browser where you can't give a block scoped variable the same name as the id of the element it represents.
	const scoreDwa = document.getElementById("scoreTwo"); //Dwa (pronounced dva) means two
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext('2d');
	canvas.width = size;
	canvas.height = size;
	document.addEventListener("keypress", function(e){
		if(e.keyCode === 32){
			if(paused) id = window.setInterval(frame, 16);
			else clearInterval(id);
			paused = !paused;
			return;
		}
		if(bindingUO){
			controls.upOne = e.key.toLowerCase();
			oneUpD.style.color = "black";
			oneUpD.innerHTML = e.key.toLowerCase(); //uppercase can cause keys to get stuck since holding shift and releasing shift, but not the key doesn't trigger keyup.
			bindingUO = false;				
			return;				
		}
		else if(bindingDO){
			controls.downOne = e.key.toLowerCase();
			oneDownD.style.color = "black";
			oneDownD.innerHTML = e.key.toLowerCase();
			bindingDO = false;
			return;
		}
		else if(bindingUT){
			controls.upTwo = e.key.toLowerCase();
			twoUpD.style.color = "black";
			twoUpD.innerHTML = e.key.toLowerCase();
			bindingUT = false;
			return;
		}
		else if(bindingDT){
			controls.downTwo = e.key.toLowerCase();
			twoDownD.style.color = "black";
			twoDownD.innerHTML = e.key.toLowerCase();
			bindingDT = false;
			return;
		}
		if(keysDown.indexOf(e.key.toLowerCase()) != -1) return;
		keysDown.push(e.key.toLowerCase());
		//console.log(keysDown);
	});
	document.addEventListener("keyup", function(e){
		if(keysDown.indexOf(e.key.toLowerCase()) != -1){
			keysDown.splice(keysDown.indexOf(e.key.toLowerCase()), 1);
		}
		//console.log(keysDown);
	});
	function drawGame(){
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.clearRect(0,0, canvas.width, canvas.height);
		ctx.fillRect(10, paddleOne, paddleW, paddleH);
		ctx.fillRect(size-10-paddleW, paddleTwo, paddleW, paddleH);
		ctx.fillRect(ballX, ballY, ballSize, ballSize);
		if(ballTimeOut){
			ctx.beginPath();
			ctx.moveTo(size/2, size/2);
			ctx.lineTo(size/2 +30*Math.cos((ballAngle*Math.PI)/180), size/2 - 30 * Math.sin((ballAngle*Math.PI)/180));
			ctx.stroke();
		}
	}
	
	function frame(){
		if (keysDown.indexOf(controls.upOne) > keysDown.indexOf(controls.downOne) && paddleOne > 0){
			paddleOne -= paddleSpeed;
			if(paddleOne < 0) paddleOne = 0;
		}
		else if (keysDown.indexOf(controls.downOne) > -1 && paddleOne + paddleH < size){
			paddleOne += paddleSpeed;
			if(paddleOne + paddleH > size) paddleOne = size-paddleH;
		}
		if (keysDown.indexOf(controls.upTwo) > keysDown.indexOf(controls.downTwo) && paddleTwo >= 0){
			paddleTwo -= paddleSpeed;
			if(paddleTwo < 0) paddleTwo = 0;
		}
		else if (keysDown.indexOf(controls.downTwo) > -1 && paddleTwo + paddleH < size){
			paddleTwo += paddleSpeed;
			if(paddleTwo + paddleH > size) paddleTwo = size-paddleH;
		}
		if(!ballTimeOut){ 
			ballX += ballSpeed * Math.cos((ballAngle*Math.PI)/180);
			ballY -= ballSpeed * Math.sin((ballAngle*Math.PI)/180);
			if(ballY >= size - ballSize || ballY <=0){
				if(!hBCoolDown){ //cieling/floor bounce
					ballAngle = 360-ballAngle;
					if(ballAngle > 3 && ballAngle < 357)ballAngle += 3*Math.random() -6; //randomness to prevent infinite volleys. The conditional prevents the ball from glitching out of bounds.
					if(ballAngle >= 360) ballAngle -=360;
					if(ballAngle < 0) ballAngle += 360;
					hBCoolDown = true;
				}
			}
			else hBCoolDown = false;
			if((ballX >= size -10 -ballSize -paddleW && ballX <= size -10 -ballSize && ballY >= paddleTwo && ballY <= paddleTwo+paddleH)|| (ballX <= 10 + paddleW && ballX > 0 && ballY <= paddleOne + paddleH && ballY > paddleOne)){ //paddle bounce
				if(!vBCoolDown){
					if(ballAngle < 180){
						ballAngle = 180-ballAngle;
					}
					else{
						ballAngle = 540-ballAngle;
					}
					vBCoolDown = true;
				}
			} //this figures out whether or not the ball hit a paddle. 
			else vBCoolDown = false;
		}
		if(ballX >= size + ballSize || ballX <= -ballSize) reset();
		drawGame();
	}
	function reset(){
		if(ballX > 0){ scoreOne++; scoreJeden.innerHTML = scoreOne;}
		else {scoreTwo++; scoreDwa.innerHTML = scoreTwo;}
		
		ballAngle = (Math.random() * 70 + 10 + (90 * Math.floor(Math.random()*4))); //the ball's angle, expressed in degrees. The formula makes sure that no angles are within 10 degrees of a cardinal (90, 180, 270, 360 degrees) angle. 
		ballX = (size - ballSize)/2;
		ballY = (size - ballSize)/2;
		ballTimeOut = true;
		window.setTimeout(function(){ballTimeOut = false}, 2500);
	} //resets after each round
	function update(){//fully resets after settings are changed.
		scorerOne = 0;
		scoreTwo = 0;
		paddleOne = (size - paddleH)/2; //coordinates of the left paddle. All coordinates represent the upper left hand corner of all objects. 
		paddleTwo = (size - paddleH)/2;
		canvas.width = size;
		canvas.height = size;
		ballAngle = (Math.random() * 70 + 10 + (90 * Math.floor(Math.random()*4))); //the ball's angle, expressed in degrees. The formula makes sure that no angles are within 10 degrees of a primary (90, 180, 270, 360 degrees) angle. 
		ballX = (size - ballSize)/2;
		ballY = (size - ballSize)/2;
		ballTimeOut = true;
		clearInterval(id);
		paused = false;
		id = window.setInterval(frame, 16);
		window.setTimeout(function(){ballTimeOut = false}, 2500);
	}
	id = window.setInterval(frame, 16);
	window.setTimeout(function(){ballTimeOut = false}, 2500);
	
	/*/None of the below has to do with the actual game, it's just
	so that you can change the settings with sliders during the runtime./*/
	const settingsB = document.getElementById("settingsToggle");
	const heightS = document.getElementById("height");
	const speedS = document.getElementById("speed");
	const ballS = document.getElementById("ballSpeed");
	const sizeS = document.getElementById("size");
	const heightD = document.getElementById("heightDisp");
	const speedD = document.getElementById("speedDisp");
	const ballD = document.getElementById("ballDisp");
	const sizeD = document.getElementById("sizeDisp");
	const bindOneUp = document.getElementById("oneUp");
	const bindOneDown = document.getElementById("oneDown");
	const bindTwoUp = document.getElementById("twoUp");
	const bindTwoDown = document.getElementById("twoDown");
	const oneUpD = document.getElementById("oneUpDisp");
	const oneDownD = document.getElementById("oneDownDisp");
	const twoUpD = document.getElementById("twoUpDisp");
	const twoDownD = document.getElementById("twoDownDisp");
	//These are just references for the HTML elements. Sorry :I
	heightS.addEventListener("change", function(){paddleH = parseInt(heightS.value); heightD.innerHTML = heightS.value; update();});
	speedS.addEventListener("change", function(){paddleSpeed = parseInt(speedS.value); speedD.innerHTML = speedS.value; update();});
	ballS.addEventListener("change", function(){ballSpeed = parseInt(ballS.value); ballD.innerHTML = ballS.value; update();});
	sizeS.addEventListener("change", function(){size = parseInt(sizeS.value); sizeD.innerHTML = sizeS.value; update();});
	
	heightS.addEventListener("mousemove", function(){heightD.innerHTML = heightS.value;});
	speedS.addEventListener("mousemove", function(){speedD.innerHTML = speedS.value;});
	ballS.addEventListener("mousemove", function(){ballD.innerHTML = ballS.value;});
	sizeS.addEventListener("mousemove", function(){sizeD.innerHTML = sizeS.value;});
	
	bindOneUp.addEventListener("click", function(){
	bindingUO = !bindingUO;
	bindingDO = false;
	bindingUT = false;
	bindingDT = false;
	oneDownD.style.color = "black";
	twoUpD.style.color = "black";
	twoDownD.style.color = "black";
	if(bindingUO) oneUpD.style.color = "red";
	else oneUpD.style.color = "black";
	});
	
	bindOneDown.addEventListener("click", function(){
	bindingUO = false;
	bindingDO = !bindingDO;
	bindingUT = false;
	bindingDT = false;
	oneUpD.style.color = "black";
	twoUpD.style.color = "black";
	twoDownD.style.color = "black";
	if(bindingDO) oneDownD.style.color = "red";
	else oneDownD.style.color = "black";
	});
	
	bindTwoUp.addEventListener("click", function(){
	bindingUO = false;
	bindingDO = false;
	bindingUT = !bindingUT;
	bindingDT = false;
	oneUpD.style.color = "black";
	oneDownD.style.color = "black";
	twoDownD.style.color = "black";
	if(bindingUT) twoUpD.style.color = "red";
	else twoUpD.style.color = "black";
	});
	
	bindTwoDown.addEventListener("click", function(){
	bindingUO = false;
	bindingDO = false;
	bindingUT = false;
	bindingDT = !bindingDT;
	oneUpD.style.color = "black";
	oneDownD.style.color = "black";
	twoUpD.style.color = "black";
	if(bindingDT) twoDownD.style.color = "red";
	else twoDownD.style.color = "black";
	});
	
	let settingsOn = false;
	settingsB.addEventListener("click", 
	function(){ if(settingsOn) document.getElementById("settings").style.display = "none"; 
	else document.getElementById("settings").style.display ="block"; 
	settingsOn = !settingsOn;});
	
});
