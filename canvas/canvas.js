const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
const lineS = document.getElementById("numlines");
const heightS = document.getElementById("height");
const widthS = document.getElementById("width");
lineS.max = heightS.value * widthS.value;
let NUMLINES = 6;
let GRIDWIDTH =11;
let GRIDHEIGHT = 7;
let nodes = [];
let lastEvent;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function draw(x,y) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawNodes();
    ctx.lineWidth = 2;
    const nearestNodes = getNearestNodes(x,y);
    for(let a = 0; a < nearestNodes.length; a++){
        ctx.strokeStyle = `rgba(9, 155, 181, ${125/nearestNodes[a][0][2]})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nearestNodes[a][0][0], nearestNodes[a][0][1]);
        ctx.stroke();
    }
}
function getNearestNodes(x,y){ //get the "nodes" nearest to your mouse.
    let nodesWDistance = [];
    for(let a = 0; a < nodes.length; a++) nodesWDistance.push([nodes[a][0], nodes[a][1], distanceToNode(nodes[a][0], nodes[a][1], x, y)]);
    let nearestNodes = []; //[x,y,distance] so I don't need to calculate distance as much. 
    for(let b = 0; b < NUMLINES && b < nodes.length; b++){
        let lowestIndex = 0;
        for(let c = 0; c < nodesWDistance.length; c++){
            if(nodesWDistance[c][2] < nodesWDistance[lowestIndex][2])
                lowestIndex = c;
        }
        nearestNodes.push(nodesWDistance.splice(lowestIndex,1));
    }
    return nearestNodes;
}
function distanceToNode(nodeX, nodeY, x, y){
    if(x  === nodeX && y === nodeY) return Number.MAX_SAFE_INTEGER;
    return Math.abs(x-nodeX) + Math.abs(y-nodeY);
}
function makeNodes(w, h){
    nodes = [];
    const width = canvas.width/w;
    const height = canvas.height/h;
    for(let x = .5; x < w; x++)
        for(let y = .5; y < h; y++){
            nodes.push([width*x, height*y, 2*Math.random()-1, 2*Math.random()-1]);
        }
    drawNodes();
}
function drawNodes(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < nodes.length; i++){
                ctx.strokeStyle = `rgba(9, 155,181, .9)`;
                ctx.lineWidth =1;
                ctx.beginPath();
                ctx.moveTo(nodes[i][0], nodes[i][1]);
                ctx.arc(nodes[i][0], nodes[i][1], 1, 0, 2* Math.PI, true);
                //ctx.lineTo(nodes[i][0], nodes[i][1]);
                ctx.stroke();
        }
}
function fix(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    makeNodes(GRIDWIDTH, GRIDHEIGHT);
}
makeNodes(GRIDWIDTH,GRIDHEIGHT);
function moveNodes(){
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i][0] >= canvas.width) nodes[i][2] = Math.random()-1; 
        if(nodes[i][0] <= 0) nodes[i][2] = Math.random();
        nodes[i][0]+= nodes[i][2];
        if(nodes[i][1] >= canvas.height) nodes[i][3] = Math.random()-1;
        if(nodes[i][1] <= 0) nodes[i][3] = Math.random();
        nodes[i][1]+=nodes[i][3];
    }
    //drawNodes();
    if (typeof lastEvent !== "undefined")
        drawMouse(lastEvent);
    else drawAll(nodes[0][0], nodes[0][1]);
}
function drawMouse(e){
    lastEvent = e;
    drawAll(e.offsetX, e.offsetY);
}
function drawAll(x,y){
    drawNodes();
    draw(x,y);
    for(let i = 0; i< nodes.length; i++){
        draw(nodes[i][0], nodes[i][1]);
    }
}
setInterval(moveNodes, 50);
canvas.addEventListener('mousemove', drawMouse);
window.addEventListener('resize', fix);
heightS.addEventListener('change', () => { GRIDHEIGHT = heightS.value; fix(); lineS.max = heightS.value * widthS.value;});
widthS.addEventListener('change', () => { GRIDWIDTH = widthS.value; fix(); lineS.max = heightS.value * widthS.value;});
lineS.addEventListener('change', () => { NUMLINES = lineS.value;});
document.querySelector("footer").addEventListener('click', () => {if(NUMLINES < 3) NUMLINES++});