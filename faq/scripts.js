let currentOne = -1;
let direction = false;
window.addEventListener('DOMContentLoaded', function(){
    const containerEl = document.getElementById("container");
    const amount = containerEl.childElementCount-1;
   for(let i = 0; i <= amount; i++){
       document.getElementById("t" + i)
       .addEventListener('click', function() {console.log(); handleClick(i);});
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
        if(opening){ //coming in, or showing the element
        $("#t"+which).addClass("expanded");
        $("#t"+which).removeClass("shrunk");
        $("#c"+which).removeClass("shrunkC");
        $("#c"+which).addClass("showC");
        }
        else{
            $("#t"+which).addClass("shrunk");
            $("#t"+which).removeClass("expanded");
            $("#c"+which).addClass("shrunkC");
            $("#c"+which).removeClass("showC");
        }
      }
      function shrinkAll(){
         for(let i = 0; i <=amount; i++)
            $("#t"+i).addClass("shrunk");
      }
});