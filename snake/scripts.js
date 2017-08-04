const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let size = 32;
let res = 15;
let dimensions = size*res;
let speed = 66;
let foodAmt = 1;
const foodAmtS = document.getElementById('foodAmt');
const speedS = document.getElementById('speed');
const resS = document.getElementById('res');
const sizeS = document.getElementById('size');
const scoreBoard = document.getElementById('score');
const settingsS = document.getElementById('settings');
const slidersD = document.getElementById('sliders');
canvas.width = dimensions;
canvas.height = dimensions;
canvas.style.width = dimensions;
canvas.style.height = dimensions;
let direction = 0; 
let lastDirection = 9;
let snake = [new Segment([5,5])];
let food = [];
//let gotFood = false;
let queue = 0;
let started = false;
let id;
let paused = false;
let settingsHide = true;
placeFood();
printGame();
document.addEventListener('keydown', (e)=>{
    //console.log(e);
    if(!paused && e.keyCode >= 37 && e.keyCode <=40 && (Math.abs(lastDirection - (e.keyCode-37)) !=2)){ //the second part is just to prevent people from bending into themselves and dying (e.g. pushing down while going up). It allows for control with arrow keys. 
        direction = e.keyCode-37;
        if(!started){id = setInterval(moveSnake, speed); started = true}
    }
    else if(e.keyCode === 32 && started){
        if(paused) id = setInterval(moveSnake, speed);
        else clearInterval(id);
        paused = !paused;
    }
    else if (!paused){ //this is for WASD. It can't be as simple or as clean as the arrow keys since their keycodes aren't in order :C 
        switch(e.keyCode){
            case 65:
                if(lastDirection != 2) direction =0;
                if(!started){id = setInterval(moveSnake, speed); started = true}
                break;
            case 68:
                if(lastDirection !=0) direction = 2;
                if(!started){id = setInterval(moveSnake, speed); started = true}
                break;
            case 83:
                if(lastDirection !=1)direction = 3;
                if(!started){id = setInterval(moveSnake, speed); started = true}
                break;
            case 87:
                if(lastDirection !=3) direction = 1;
                if(!started){id = setInterval(moveSnake, speed); started = true}
                break;
            default:
                break;
        }
    }
});

function placeFood(){
    let randPos =[
        Math.floor(Math.random()*size),
        Math.floor(Math.random()*size)
    ];
    for(let i = 0; i < snake.length; i++){
        if (samePos(randPos, snake[i].position)){placeFood(); return;}
    }
    food[0] = randPos[0];
    food[1] = randPos[1];
}
function Segment(position){
    this.position = position;
    this.moveTo = function(otherSegment){
        this.position[0] = otherSegment.position[0];
        this.position[1] = otherSegment.position[1];
    };
    this.moveForward = function(){
        lastDirection = direction;
        switch(direction){
            case 0:
                this.position[1]--;
                break;
            case 1:
                this.position[0]--;
                break;
            case 2:
                this.position[1]++;
                break;
            case 3:
                this.position[0]++;
                break;
        }
    };
}
function moveSnake(){
    if(queue >0) {snake.unshift(new Segment([0,0])); queue--} //if they ate some food before, extend the length of the snake. 
    //snake.unshift(new Segment([0,0]));
    scoreBoard.innerHTML = snake.length; 
    for(let i = 0; i < snake.length-1; i++){
        snake[i].moveTo(snake[i+1]);
        // console.log(snake[i].position);
    }
    snake[snake.length-1].moveForward(); //move the head forward
    // console.log(snake[snake.length-1].position);
    // console.log('____________________________________');
    printGame();
    if(samePos(snake[snake.length-1].position, food)){ queue += foodAmt; placeFood()}
    if (snake[snake.length-1].position[0] >= size || snake[snake.length-1].position[1] >= size || snake[snake.length-1].position[0] < 0 || snake[snake.length-1].position[1] < 0){
        endgame();
        return;
    }
    for(var i = 0; i < snake.length-1; i++){
        if(samePos(snake[i].position, snake[snake.length-1].position)){
            endgame();
            return; 
        }
    }
    
}
function printGame(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(food[1]*res + res/4, food[0]*res+res/4, res/2, res/2);
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = `rgb(${160-((snake.length-1-i)*4)}, ${240-((snake.length-1-i))}, ${180-((snake.length-1-i)*2)})`;
        //ctx.fillStyle = '#1ce00b';
        //if((snake.length - 1 - i) %2 == 0) ctx.fillStyle = '#284f25'; // it's not just i%2 since it starts from the tail and goes to the head. This way, the head is always 0 and is thus always dark green, rather than the tail always being the same color and the head changing color. 
        ctx.fillRect(snake[i].position[1]*res, snake[i].position[0]*res, res, res);
    }
}
function samePos(pos1, pos2){
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}
function endgame(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    alert("You died");
    clearInterval(id);
    lastDirection = 9;
    direction = 0; 
    snake = [new Segment([5,5])];
    food = [];
    gotFood = false;
    started = false;
    paused = false;
    placeFood();
    printGame();
}
speedS.addEventListener('change', () => { speed = speedS.value; update()});
sizeS.addEventListener('change', () => { size = sizeS.value; update()});
resS.addEventListener('change', () => { res = resS.value; update()});
foodAmtS.addEventListener('change', () => { foodAmt = foodAmtS.value; update()});
settingsS.addEventListener('click', ()=> {if (settingsHide) {slidersD.style.display ='block'; settingsHide = false;}
    else {slidersD.style.display = 'none'; settingsHide = true;}
});
function update(){
    clearInterval(id);
    lastDirection = 9;
    direction = 0; 
    snake = [new Segment([5,5])];
    food = [];
    //gotFood = false;
    started = false;
    paused = false;
    dimensions = size*res;
    canvas.width = dimensions;
    canvas.height = dimensions;
    canvas.style.width = dimensions;
    canvas.style.height = dimensions;
    placeFood();
    printGame();
}

