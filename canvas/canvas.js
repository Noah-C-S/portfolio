let NUMLINES = 6;
let amount = 77;
let nodes = [];
let lastEvent;
window.addEventListener('DOMContentLoaded', function(){
    const canvas = document.querySelector('#draw');
    const ctx = canvas.getContext('2d');
    const lineS = document.getElementById("numlines");
    const amountS = document.getElementById("amount");
    const amountD = document.getElementById("amountDisp");
    const linesD = document.getElementById("linesDisp");
    lineS.max = amountS.value;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    function node(){
            this.x = Math.random()*canvas.width;
            this.y = Math.random()*canvas.height;
            this.xd = 2*Math.random()-1;
            this.yd = 2*Math.random()-1;
            this.move = function(){
              if(this.x >= canvas.width) this.xd = Math.random()-1; 
              if(this.x <= 0) this.xd = Math.random();
              if(this.y >= canvas.height) this.yd = Math.random() ;
              if(this.y <= 0) this.yd = Math.random();
              this.x += this.xd;
              this.y += this.yd;
            };
            this.draw = function(){
                ctx.strokeStyle = "rgba(9, 155,181, .9)";
                ctx.lineWidth =1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.arc(this.x, this.y, 1, 0, 2* Math.PI, true);
                //ctx.lineTo(nodes[i].x, nodes[i].y);
                ctx.stroke();
            };
        }
    function draw(x,y) {
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            //drawNodes();
            ctx.lineWidth = 2;
            const nearestNodes = getNearestNodes(x,y);
            for(let a = 0; a < nearestNodes.length; a++){
                ctx.strokeStyle = "rgba(240, 240, 240," +50/nearestNodes[a][1]+ ")";
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nearestNodes[a][0].x, nearestNodes[a][0].y);
                ctx.stroke();
            }
        }
    function getNearestNodes(x,y){ //get the "nodes" nearest to your mouse.
            let nodesWDistance = [];
            for(let a = 0; a < nodes.length; a++) nodesWDistance.push([nodes[a], distanceToNode(nodes[a].x, nodes[a].y, x, y)]);
            let nearestNodes = []; //[x,y,distance] so I don't need to calculate distance as much. 
            for(let b = 0; b < NUMLINES && b < nodes.length; b++){
                let lowestIndex = 0;
                for(let c = 0; c < nodesWDistance.length; c++){
                    if(nodesWDistance[c][1] < nodesWDistance[lowestIndex][1])
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
        function makeNodes(amount){
            nodes = [];
            for(let x = 0; x < amount; x++) nodes[x] = new node();
            drawNodes();
        }
    function drawNodes(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for(let i = 0; i < nodes.length; i++){
                        nodes[i].draw();
                }
        }
    function fix(){
            let oldwidth = canvas.width;
            let oldheight = canvas.height;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            for(let x = 0; x < nodes.length; x++)
            {
                nodes[x].x = nodes[x].x*(canvas.width/oldwidth);
                nodes[x].y = nodes[x].y * (canvas.height/oldheight);
                // [nodes[x][0], nodes[x][1]] = [nodes[x][0] * (canvas.width/oldwidth), nodes[x][1] * (canvas.height/oldheight)];
                // [lastEvent[0], lastEvent[1]] = [lastEvent[0] * (canvas.width/oldwidth), lastEvent[1] * (canvas.height/oldheight)];
            }
            lastEvent[0] = lastEvent[0] * (canvas.width/oldwidth);
            lastEvent[1] = lastEvent[1] * (canvas.height/oldheight);
            //makeNodes(GRIDWIDTH, GRIDHEIGHT);
        }
    makeNodes(amount);
    function moveNodes(){
            for(let i = 0; i < nodes.length; i++)
            {
                nodes[i].move();
            }
            //drawNodes();
            if (typeof lastEvent !== "undefined")
                drawAll(lastEvent[0], lastEvent[1]);
            else drawAll(nodes[0][0], nodes[0][1]);
        }
    function drawMouse(e){
        lastEvent = [e.offsetX, e.offsetY];
        drawAll(e.offsetX, e.offsetY);
    }
    function drawAll(x,y){
        drawNodes();
        draw(x,y);
        for(let i = 0; i< nodes.length; i++){
            draw(nodes[i].x, nodes[i].y);
        }
    }
    function drawTouch(e){
        const rect = e.target.getBoundingClientRect();
        //console.log(e);
        //console.log( [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top]);
        lastEvent = [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top];
        drawAll(e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top);
    }
    setInterval(moveNodes, 50);
    canvas.addEventListener('mousemove', drawMouse);
    canvas.addEventListener('touchmove', drawTouch);
    window.addEventListener('resize', fix);
    amountS.addEventListener('mousemove', function() {amountD.innerHTML = amountS.value});
    lineS.addEventListener('mousemove', function() {linesD.innerHTML = lineS.value});
    amountS.addEventListener('change', function(){amountD.innerHTML = amountS.value; amount = amountS.value; makeNodes(amount); lineS.max = amountS.value;});
    lineS.addEventListener('change', function(){linesD.innerHTML = lineS.value; NUMLINES = lineS.value;});
});