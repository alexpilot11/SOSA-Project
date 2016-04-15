/**
 * Created by alex on 3/21/16.
 */

function reorderElements() {

    var orders = document.getElementsByClassName("order_box")[0];
    var stimuli = document.getElementsByClassName("stim_box")[0];



    var chosen_order = orders.value;


    while (stimuli.options.length > 0) {
        stimuli.options[0] = null;
    }
    var op;
    if (chosen_order == "o1") {
        op = new Option("Stimuli 1", "s1");
        stimuli.options[0] = op;

        op = new Option("Stimuli 2", "s2");
        stimuli.options[1] = op;

        op = new Option("Stimuli 3", "s3");
        stimuli.options[2] = op;

        op = new Option("Stimuli 4", "s4");
        stimuli.options[3] = op;

        op = new Option("Stimuli 5", "s5");
        stimuli.options[4] = op;
    }
    else if (chosen_order == "o2") {
        op = new Option("Stimuli 5", "s5");
        stimuli.options[0] = op;

        op = new Option("Stimuli 4", "s4");
        stimuli.options[1] = op;

        op = new Option("Stimuli 3", "s3");
        stimuli.options[2] = op;

        op = new Option("Stimuli 2", "s2");
        stimuli.options[3] = op;

        op = new Option("Stimuli 1", "s1");
        stimuli.options[4] = op;

    }
    else if (chosen_order == "o3") {
        op = new Option("Stimuli 4", "s5");
        stimuli.options[0] = op;

        op = new Option("Stimuli 3", "s4");
        stimuli.options[1] = op;

        op = new Option("Stimuli 2", "s3");
        stimuli.options[2] = op;

        op = new Option("Stimuli 5", "s5");
        stimuli.options[3] = op;

        op = new Option("Stimuli 1", "s1");
        stimuli.options[4] = op;

    }
    return;
}

function reorderStims() {

    var orders = document.getElementsByClassName("order_box")[0];

    var chosen_order = orders.value;
    var stims = document.getElementsByClassName("board-stim-img");
    var stim_labels = document.getElementsByClassName("board-stim-label");

    var tmpArray = new Array();

    for (var i = 0; i < stims.length; i++) {
        tmpArray[i] = new Array();
        tmpArray[i] = stims[i].src;
    }


    if (chosen_order == "o1") {

        stim_labels[0].innerHTML = "test 1";
        stim_labels[1].innerHTML = "test 2";
        stim_labels[2].innerHTML = "test 3";
        stim_labels[3].innerHTML = "test 4";
        stim_labels[4].innerHTML = "test 5";

        stims[0].src = "img/test1.png";
        stims[1].src = "img/test2.png";
        stims[2].src = "img/test3.png";
        stims[3].src = "img/test4.jpg";
        stims[4].src = "img/test5.jpg";

    }
    else if (chosen_order == "o2") {
        stim_labels[0].innerHTML = "test 5";
        stim_labels[1].innerHTML = "test 4";
        stim_labels[2].innerHTML = "test 3";
        stim_labels[3].innerHTML = "test 2";
        stim_labels[4].innerHTML = "test 1";

        stims[0].src = "img/test5.jpg";
        stims[1].src = "img/test4.jpg";
        stims[2].src = "img/test3.png";
        stims[3].src = "img/test2.png";
        stims[4].src = "img/test1.png";

    }
    else if (chosen_order == "o3") {
        stim_labels[0].innerHTML = "test 4";
        stim_labels[1].innerHTML = "test 3";
        stim_labels[2].innerHTML = "test 2";
        stim_labels[3].innerHTML = "test 5";
        stim_labels[4].innerHTML = "test 1";

        stims[0].src = "img/test4.jpg";
        stims[1].src = "img/test3.png";
        stims[2].src = "img/test2.png";
        stims[3].src = "img/test5.jpg";
        stims[4].src = "img/test1.png";

    }
    return;

}

function showValueR(newValue, boardClass){
    var redVal = "redVal";
    if (boardClass == "background") {
        redVal += "-tint";
    }
    document.getElementById(redVal).innerHTML=newValue;
}

function showValueG(newValue, boardClass){
    var greenVal = "greenVal";
    if (boardClass == "background") {
        greenVal += "-tint";
    }
    document.getElementById(greenVal).innerHTML=newValue;
}

function showValueB(newValue, boardClass){
    var blueVal = "blueVal";
    if (boardClass == "background") {
        blueVal += "-tint";
    }
    document.getElementById(blueVal).innerHTML=newValue;
}

function colorUpdate(boardClass) {
    var redVal="redVal", greenVal="greenVal", blueVal="blueVal";
    if (boardClass == "background") {
        redVal += "-tint";
        greenVal += "-tint";
        blueVal += "-tint";
    }
    var r = document.getElementById(redVal).innerHTML;
    var g = document.getElementById(greenVal).innerHTML;
    var b = document.getElementById(blueVal).innerHTML;
    document.getElementsByClassName(boardClass)[0].style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}

function doAllThisRed(newValue, boardClass){
    showValueR(newValue, boardClass);
    colorUpdate(boardClass);
}

function doAllThisGreen(newValue, boardClass){
    showValueG(newValue, boardClass);
    colorUpdate(boardClass);
}

function doAllThisBlue(newValue, boardClass){
    showValueB(newValue, boardClass);
    colorUpdate(boardClass);
}

function updateLabelPosition(newValue) {
    var pos = document.getElementById("position-val-text");
    pos.innerHTML = newValue;
    var labels = document.getElementsByClassName("board-stim-label");
    for (var i = 0; i < labels.length; i++){
        labels[i].style.top = (newValue - 10) + "px";
    }

}

function updateLabelShade(newValue) {
    var shade = document.getElementById("shade-val-text");
    shade.innerHTML = newValue;
    var labels = document.getElementsByClassName("board-stim-label");

    for (var i = 0; i < labels.length; i++){
        var rgb = getComputedStyle(labels[i]).color.match(/\d+/g);
        //TODO: THIS IS THE WRONG WAY TO DO THIS!!!!!!
        rgb[0] = parseInt(rgb[0]) + newValue-50;
        rgb[1] = parseInt(rgb[1]) + newValue-50;
        rgb[2] = parseInt(rgb[2]) + newValue-50;
        console.log(rgb);

        labels[i].style.color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2];
        //labels[i].style.color += "rgb(" + newValue - 50 + ",";
        //labels[i].innerHTML += newValue - 50;
        //labels[i].innerHTML += newValue - 50;
    }

}

function updateLabelSize(newValue) {
    var size = document.getElementById("size-val-text");
    size.innerHTML = newValue;
    var labels = document.getElementsByClassName("board-stim-label");
    for (var i = 0; i < labels.length; i++){
        labels[i].style.webkitTransform = "scale(" + newValue/10 + ")";
    }
}

