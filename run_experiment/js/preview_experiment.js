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




