let currentOne = -1;
let direction = false;
window.addEventListener('DOMContentLoaded', function(){
    const containerEl = document.getElementById("container");
    const amount = containerEl.childElementCount-1;
   for(let i = 0; i <= amount; i++){
       document.getElementById("t" + i)
       .addEventListener('click', function() {handleClick(i);});
   }
   function handleClick(clicked){
        // console.log(clicked);
        if(currentOne === -1) shrinkAll();
        if(currentOne  >= amount) direction = false;
        else if (currentOne <= 0) direction = true;
        if(direction){
          animate(currentOne, false);
          if(isNaN(clicked) || currentOne === clicked || clicked > amount) currentOne++;
          else currentOne = clicked;
          animate(currentOne, true);
         }
         else {
          animate(currentOne, false);
          if(isNaN(clicked) || currentOne === clicked || clicked > amount) currentOne--;
          else currentOne = clicked;
          animate(currentOne, true);
         }
   }
      function animate(which, opening){
        if(which < 0 || which > amount) return;
        let time = document.getElementById("t" + which);
        let content = document.getElementById("c" + which);
        if(opening){ //coming in, or showing the element
            time.classList.add("expanded");
            time.classList.remove("shrunk");
            content.classList.add("showC");
            content.classList.remove("shrunkC");
        }
        else{
            time.classList.remove("expanded");
            time.classList.add("shrunk");
            content.classList.remove("showC");
            content.classList.add("shrunkC");
        }
      }
      function shrinkAll(){
         for(let i = 0; i <=amount; i++)
         document.getElementById("t" + i).classList.add("shrunk");
      }
});