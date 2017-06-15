const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');
let hidden = false;
// const lineS = document.getElementById("numlines");
// const heightS = document.getElementById("height");
// const widthS = document.getElementById("width");
// lineS.max = heightS.value * widthS.value;
let NUMLINES = -1;
let GRIDWIDTH =11;
let GRIDHEIGHT = 7;
let nodes = [];
let lastEvent = [0,0];
canvas.width = $("#footer").width();
canvas.height = $("#footer").height();
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
function draw(x,y) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawNodes();
    ctx.lineWidth = 2;
    const nearestNodes = getNearestNodes(x,y);
    for(let a = 0; a < nearestNodes.length; a++){
        ctx.strokeStyle = `rgba(240, 240, 240, ${50/nearestNodes[a][2]})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nearestNodes[a][0], nearestNodes[a][1]);
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
        nearestNodes.push(nodesWDistance.splice(lowestIndex,1)[0]);
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
    let oldwidth = canvas.width;
    let oldheight = canvas.height;
    canvas.width = $("#footer").width();
    canvas.height = $("#footer").height();
    for(let x = 0; x < nodes.length; x++)
    {
        [nodes[x][0], nodes[x][1]] = [nodes[x][0] * (canvas.width/oldwidth), nodes[x][1] * (canvas.height/oldheight)];
        [lastEvent[0], lastEvent[1]] = [lastEvent[0] * (canvas.width/oldwidth), lastEvent[1] * (canvas.height/oldheight)];
    }
    //makeNodes(GRIDWIDTH, GRIDHEIGHT);
}
// function reset(){
//     canvas.width = $("#footer").width();
//     canvas.height = $("#footer").height();
//     makeNodes(GRIDWIDTH, GRIDHEIGHT);
// }
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
        drawAll(lastEvent[0], lastEvent[1]);
    else drawAll(nodes[0][0], nodes[0][1]);
}
function drawMouse(e){
    // console.log(e);
    // console.log([e.offsetX, e.offsetY]);
    lastEvent = [e.offsetX, e.offsetY];
    drawAll(e.offsetX, e.offsetY);
}
function drawTouch(e){
    const rect = e.target.getBoundingClientRect();
    // console.log(e);
    // console.log( [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top]);
    lastEvent = [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top];
    drawAll(e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top);
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
canvas.addEventListener('touchmove', drawTouch);
window.addEventListener('resize', fix);
// heightS.addEventListener('change', () => { GRIDHEIGHT = heightS.value; reset(); lineS.max = heightS.value * widthS.value;});
// widthS.addEventListener('change', () => { GRIDWIDTH = widthS.value; reset(); lineS.max = heightS.value * widthS.value;});
// lineS.addEventListener('change', () => { NUMLINES = lineS.value;});
const footerEl = document.getElementById("footer");
footerEl.addEventListener('click', () => {if(NUMLINES < 8) NUMLINES++; if(!hidden) {$("#footerContent").hide(); $("#draw").show(); fix(); hidden = true;} if(NUMLINES> 0) $("#draw").css("cursor", "none");});
const navExpandEl = document.getElementById("navExpand"); //El is added to the end of these to fix a bizzarre bug in Safari where you can't have a const variable with name of the ID that the element it contains has. 
const mobileNavEl = document.getElementById("mobileNav");
const hamburgerEl = document.getElementById("hamburger");
let navShown = false;
//I don't use jQuery here because it wasn't working in some browsers leading me to use pure Javascript hoping for more compatibility. 
navExpandEl.addEventListener("click", () =>{
    if(navShown) {mobileNavEl.classList.add("hidden"); mobileNavEl.classList.remove("shown"); hamburgerEl.classList.remove("is-active"); navShown = false;}
    else{mobileNavEl.classList.remove("hidden"); mobileNavEl.classList.add("shown"); hamburgerEl.classList.add("is-active"); navShown = true;} 
});
const pageEl = document.getElementById("page");
pageEl.addEventListener("click", () =>{
   if(!navShown) return;
   mobileNavEl.classList.add("hidden");
   mobileNavEl.classList.remove("shown");
   hamburgerEl.classList.remove("is-active"); 
   navShown = false;
});
pageEl.addEventListener("touchstart", () =>{
   if(!navShown) return;
   mobileNavEl.classList.add("hidden");
   mobileNavEl.classList.remove("shown");
   hamburgerEl.classList.remove("is-active"); 
   navShown = false;
});