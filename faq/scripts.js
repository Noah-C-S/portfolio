//This may have a bunch of commented out velocity animations. Try to ignore it, I switched to css3 animations a while ago because it's better for simple animations like this. 
let currentOne = -1;
const amount = 6;
let magicNum = -1;
let direction = false;
// let animating = false; 
$(document).ready(() => {
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

//if(jQuery.browser.mobile){$(".time").css("transition", "all 500ms ease-in-out"); $(".content").css("transition", "font-size 500ms, visibility 0s 500ms");}
$("#container").mousewheel((turn, delta)=>{
      //if (jQuery.browser.mobile) return;
      if(currentOne === -1) shrinkAll();
      if(delta < 0 && currentOne < amount){
          direction = true;
          animate(currentOne, false);
          currentOne++;
          animate(currentOne, true);
      }
      else if(delta > 0 && currentOne > 0){
          direction = false;
          animate(currentOne, false);
          currentOne--;
          animate(currentOne, true);
      }
      else if(delta >0 && currentOne === -1){
         currentOne = 0;
         animate(currentOne, true);
      }

   });
   const containerEl = document.getElementById("container");
   containerEl.addEventListener("click", (e) => {
         if(currentOne === -1) shrinkAll();
         if(currentOne === amount) direction = false;
         else if (currentOne === 0) direction = true;
         let clicked;
         try{
            if(magicNum < 0)
                for(let i = 0; i < e.path.length; i++){ //The magic number allows the computer to find which element is the one that contains the id that I'm looking for. At first, I thought it would be the same every time, but for some reason it's not so the browser just needs to calculate it each time. The only problems are that the first one always expands the first time, no matter which element you actually clicked, and I also can't used any ids that begin with t anywhere else on the page. 
                    if (e.path[i].id.charAt(0) === 't' && e.path[i].id.length === 2) magicNum = e.path.length - i; 
                }
         clicked = parseInt(e.path[e.path.length-magicNum].id.replace("t", ""));
         }
         catch(ev){
         clicked = NaN;
         }
         finally{
             //console.log(clicked);
             if(direction || currentOne <= 0){
              animate(currentOne, false);
              if(isNaN(clicked) || currentOne === clicked) currentOne++;
              else currentOne = clicked;
              animate(currentOne, true);
              direction = true;
             }
             else {
              animate(currentOne, false);
              if(isNaN(clicked) || currentOne === clicked) currentOne--;
              else currentOne = clicked;
              animate(currentOne, true);
             }
         }
   });
   function preventDefault(e){
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false; 
   }
   function disableScroll(e){
       if(jQuery.browser.mobile) return;
         if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        // window.ontouchmove  = preventDefault; // mobile
   }
   function enableScroll(){
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null; 
        window.onwheel = null; 
        // window.ontouchmove = null;
   }
   containerEl.addEventListener('mouseover', disableScroll);
   containerEl.addEventListener('mouseout', enableScroll);
   containerEl.addEventListener('mouseover', (e) =>{
      if(magicNum < 0){
        try{
                for(let i = 0; i < e.path.length; i++){ //this fixed the bug that causes the first click to expand the top one regardless of where the user clicked, except on mobile.
                    if (e.path[i].id.charAt(0) === 't' && e.path[i].id.length === 2) magicNum = e.path.length - i; 
                    break;
                } 
        }
        catch(ev){
            magicNum = -1;
        }
      }
   });
      function animate(which, opening){
        if(opening){ //coming in, or showing the element
        $(`#t${which}`).addClass("expanded");
        $(`#t${which}`).removeClass("shrunk");
        $(`#c${which}`).removeClass("shrunkC");
        $(`#c${which}`).addClass("showC");
        }
        else{
            $(`#t${which}`).addClass("shrunk");
            $(`#t${which}`).removeClass("expanded");
            $(`#c${which}`).addClass("shrunkC");
            $(`#c${which}`).removeClass("showC");
        }
         }
      function shrinkAll(){
         for(let i = 0; i <=amount; i++)
            $(`#t${i}`).addClass("shrunk");
      }
});
