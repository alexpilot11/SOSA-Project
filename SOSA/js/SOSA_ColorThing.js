function showValueR(newValue){
  document.getElementById("redVal").innerHTML=newValue;
}

function showValueG(newValue){
  document.getElementById("greenVal").innerHTML=newValue;
}
			
function showValueB(newValue){
  document.getElementById("blueVal").innerHTML=newValue;
}

function colorUpdate() {
  var r = document.getElementById("redVal").innerHTML;
  var g = document.getElementById("greenVal").innerHTML;
  var b = document.getElementById("blueVal").innerHTML;
  document.getElementById("board").style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}
			
function doAllThisRed(newValue){
  showValueR(newValue);
  colorUpdate();
}

function doAllThisGreen(newValue){
  showValueG(newValue);
  colorUpdate();
}
			
function doAllThisBlue(newValue){
  showValueB(newValue);
  colorUpdate();
}
