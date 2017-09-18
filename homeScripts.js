let text = "Hi, I'm Noah. I'm a high school student who likes ";
const likesConst = ["coding.",  "hiking.", "swimming.", "history.", "turtles.", "technology."];
let likes = [];
resetLikes();
let index = 0;
let like = 0;
const likesEl = document.getElementById("likes");
const textEl = document.getElementById("text");
const nextCharEl = document.getElementById("nextChar");
function resetLikes(){
    for(let i = 0; i< likesConst.length; i++){
        likes.push(likesConst[i]);
    }
}
window.addEventListener('DOMContentLoaded', function(){
    let wId = window.setInterval(addLetter, 50);
    let lId;
    let bId;
    function addLetter(){
        textEl.innerHTML = textEl.innerHTML + text.charAt(index);
        index++;
        if (index >= text.length){
            // textEl.innerHTML = textEl.innerHTML + " ";
            index = 0;
            window.clearInterval(wId);
            lId = window.setInterval(addLike, 50);
        }
    }
    function addLike(){
        likesEl.innerHTML = likesEl.innerHTML + likes[like].charAt(index);
        index++;
        if(index >= likes[like].length){
            index = 0;
            window.clearInterval(lId);
            bId = window.setInterval(blink, 450);
            removeLike();
        }
    }
    function removeLike(){
        window.setTimeout(function() {likesEl.classList.add("highlighted");}, 1700)
        // let lastLike = like;
        likes.splice(like,1);
        if(likes.length < 1) resetLikes();
        // while(like === lastLike){
        like = Math.floor(Math.random()*likes.length);
        // }
        window.setTimeout(function() {likesEl.innerHTML = ""; likesEl.classList.remove("highlighted"); window.clearInterval(bId);}, 2000);
        window.setTimeout(function() {lId = window.setInterval(addLike, 50)}, 2250);
    }
    function blink(){
        nextCharEl.classList.toggle("hiddenSpace");
    }
    
    // function revealNav(){
    //     links.css;
    // }
    
});