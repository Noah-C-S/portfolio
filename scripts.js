let hidden = false;
// const lineS = document.getElementById("numlines");
// const heightS = document.getElementById("height");
// const widthS = document.getElementById("width");
// lineS.max = heightS.value * widthS.value;
let NUMLINES = -1;
let amount =77;
let nodes = [];
let lastEvent = [0,0];
let footerEl;
window.addEventListener('DOMContentLoaded', function(){
    const canvas = document.getElementById('draw');
     footerEl = document.getElementById("footer");
    const ctx = canvas.getContext('2d');
    canvas.width = footerEl.clientWidth;
    canvas.height = footerEl.clientHeight;
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
          if(this.y >= canvas.height) this.yd = Math.random() -1;
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
        // ctx.lineWidth = 2;
        const nearestNodes = getNearestNodes(x,y);
        for(let a = 0; a < nearestNodes.length; a++){
            ctx.strokeStyle = "rgba(240, 240, 240," +50/nearestNodes[a][1]+ ")";
            ctx.lineWidth = 1.25 + 1.5/nearestNodes[a][1];
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
        canvas.width = footerEl.clientWidth;
        canvas.height = footerEl.clientHeight;
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
    // function reset(){
    //     canvas.width = $("#footer").width();
    //     canvas.height = $("#footer").height();
    //     makeNodes(GRIDWIDTH, GRIDHEIGHT);
    // }
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
        // console.log(e);
        // console.log([e.offsetX, e.offsetY]);
        lastEvent = [e.offsetX, e.offsetY];
        drawAll(e.offsetX, e.offsetY);
    }
    function drawTouch(e){
        const rect = e.target.getBoundingClientRect();
        //console.log(e);
        //console.log( [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top]);
        lastEvent = [e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top];
        drawAll(e.changedTouches[0].clientX, e.changedTouches[0].clientY-rect.top);
    }
    function drawAll(x,y){
        drawNodes();
        draw(x,y);
        for(let i = 0; i< nodes.length; i++){
            draw(nodes[i].x, nodes[i].y);
        }
    }
    canvas.addEventListener('mousemove', drawMouse);
    canvas.addEventListener('touchmove', drawTouch);
    window.addEventListener('resize', fix);
    const fContent = document.getElementById("footerContent");
    footerEl.addEventListener('click', function(){if(NUMLINES < 8) NUMLINES++; if(!hidden){ fContent.style.display= "none"; canvas.style.display = "inline"; fix(); hidden = true; setInterval(moveNodes, 50);} if(NUMLINES> 0) canvas.style.cursor = "none";});
    const navExpandEl = document.getElementById("navExpand"); //El is added to the end of these names to fix a bizzarre bug in Safari where you can't have a const variable with name of the ID that the element it contains has. 
    const mobileNavEl = document.getElementById("mobileNav");
    const hamburgerEl = document.getElementById("hamburger");
    let navShown = false;
    //I don't use jQuery here because it wasn't working in some browsers leading me to use pure Javascript hoping for more compatibility. Sadly, it didn't help, but this works just as well, if not better, than jQuery. it just took a little longer to write.
    navExpandEl.addEventListener("click", function(){
        console.log("clicked!");
        navShown = !navShown; mobileNavEl.classList.toggle('hidden'); mobileNavEl.classList.toggle('shown'); hamburgerEl.classList.toggle('is-active');
        // if(navShown) {mobileNavEl.classList.add("hidden"); mobileNavEl.classList.remove("shown"); hamburgerEl.classList.remove("is-active"); navShown = false;}
        // else{mobileNavEl.classList.remove("hidden"); mobileNavEl.classList.add("shown"); hamburgerEl.classList.add("is-active"); navShown = true;} 
    });
    let pageEl;
    if(document.getElementById("page") != null) pageEl = document.getElementById("page");
    else pageEl = document.getElementById("home");
    pageEl.addEventListener("click", function(){
       if(!navShown) return;
       mobileNavEl.classList.add("hidden");
       mobileNavEl.classList.remove("shown");
       hamburgerEl.classList.remove("is-active"); 
       navShown = false;
    });
    pageEl.addEventListener("touchstart", function(){
       if(!navShown) return;
       mobileNavEl.classList.add("hidden");
       mobileNavEl.classList.remove("shown");
       hamburgerEl.classList.remove("is-active"); 
       navShown = false;
    });
});