function showValueR(newValue){
  document.getElementById("redVal").innerHTML=newValue;
}

function showValueRp(newValue){
  document.getElementById("redValp").innerHTML=newValue;
}

function showValueG(newValue){
  document.getElementById("greenVal").innerHTML=newValue;
}

function showValueGp(newValue){
  document.getElementById("greenValp").innerHTML=newValue;
}
			
function showValueB(newValue){
  document.getElementById("blueVal").innerHTML=newValue;
}

function showValueBp(newValue){
  document.getElementById("blueValp").innerHTML=newValue;
}

function colorUpdate() {
  var r = document.getElementById("redVal").innerHTML;
  var g = document.getElementById("greenVal").innerHTML;
  var b = document.getElementById("blueVal").innerHTML;
  document.getElementById("board").style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}

function colorUpdatep() {
  var r = document.getElementById("redValp").innerHTML;
  var g = document.getElementById("greenValp").innerHTML;
  var b = document.getElementById("blueValp").innerHTML;
  document.getElementById("boardp").style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}
			
function doAllThisRed(newValue){
  showValueR(newValue);
  colorUpdate();
}

function doAllThisRedp(newValue){
  showValueRp(newValue);
  colorUpdatep();
}

function doAllThisGreen(newValue){
  showValueG(newValue);
  colorUpdate();
}

function doAllThisGreenp(newValue){
  showValueGp(newValue);
  colorUpdatep();
}
			
function doAllThisBlue(newValue){
  showValueB(newValue);
  colorUpdate();
}

function doAllThisBluep(newValue){
  showValueBp(newValue);
  colorUpdatep();
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction2() {
	document.getElementById("myDropdown2").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn2')) {

    var dropdowns = document.getElementsByClassName("dropdown-content2");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
