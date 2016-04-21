//global vars to make things easier
var container, board, stim_board, info;
var camera, controls, scene, renderer;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var objects = [], stim_labels = [], plane;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;

var outputLocationString;
var canvas1 = [], context1 = [];

var boardColor;
var bgColor;
var labelPos = 0;
var labelColor = "rgba(255,0,0,.95)";
var labelTexture;
var labelSize;
var canvaslabel = document.createElement('canvas');
var contextlabel = canvaslabel.getContext('2d');
var labelsChanged = false;
var preppedStim;
var labelsShowing = true;

var objMovementTracker = {};
var dummy;

//Scene setup
function init() {
    //container of scene. this is the div that holds all the threejs stuff
    container = document.createElement('div');
    container.setAttribute('class', 'draggable');
    document.body.appendChild(container);

    //top information
    info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = '#FFFFFF';
    info.innerHTML = '<p>Preview Experiment</p>';
    container.appendChild(info);

    //camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;
    camera.position.y = 515;

    //controls. This handles things like the zoom, pan, etc.
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 0.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    //the scene. Add things to this to get them to show up in the page
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x505050));

    //light stuff up
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    light.castShadow = true;
    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;
    light.shadowBias = -0.00022;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    scene.add(light);

    //Board
    //the windowHalfX and Y make it so that it sets the board at different sizes for different screens
    var geometry = new THREE.BoxGeometry(windowHalfX * 1.5, 20, windowHalfY * 1.8);
    for (var i = 0; i < geometry.faces.length; i += 2) {
        var colo = "rgb(255, 255, 255)";
        geometry.faces[i].color.set(new THREE.Color(colo));
        geometry.faces[i + 1].color.set(new THREE.Color(colo));
    }
    var material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, overdraw: 0.5});
    board = new THREE.Mesh(geometry, material);
    board.position.y = 0;
    board.position.x = -100;
    board.rotation.x = 1;
    scene.add(board);
    board.visible = true;

    //used to rotate stims when board rotates
    dummy = new THREE.Object3D();
    dummy.rotation.x = board.rotation.x - 1;
    scene.add(dummy);

    //an invisible plane. used for some draggable stuff
    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
        new THREE.MeshBasicMaterial({visible: false})
    );
    scene.add(plane);

    //create the gui and the stims
    createGUI();

    //Renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    //Resize event listener
    window.addEventListener('resize', onWindowResize, false);

    //mouse event listeners
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

}

function onWindowResize() {
    //This could actually scale stuff later, but for now it just changes these variables and makes the camera look right
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
//a lot of the code for the next three functions or so is from http://threejs.org/examples/#webgl_interactive_draggablecubes
function onDocumentMouseMove(event) {
    //this is the method used to drag stims around
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (SELECTED) {
        var intersects_board = raycaster.intersectObject(board);
        //only drag over the board (using a raycaster)
        if (intersects_board.length > 0 && SELECTED.canMove) {
            SELECTED.onStimBoard = false;
            SELECTED.position.copy(intersects_board[0].point.sub(offset));
            //make sure the stims are positioned on the board correctly instead of sitting inside the board
            //(hardcoded. probably would be good to do this dynamically later and get like half the
            //size of SELECTED or something, but you'd need to play with it to make it look right
            SELECTED.position.x += 30;
            SELECTED.position.y += 30;
            SELECTED.position.z += 30;
            SELECTED.rotation.copy(board.rotation);
        }
        return;
    }
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            plane.position.copy(INTERSECTED.position);
            plane.lookAt(camera.position);
        }
        container.style.cursor = 'pointer';
    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        container.style.cursor = 'auto';
    }
}

function onDocumentMouseDown(event) {
    //sets SELECTED to the stim that was clicked on. SELECTED is used in mouse move to make the SELECTED stim
    //follow the mouse
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        controls.enabled = false;
        SELECTED = intersects[0].object;


        var intersects = raycaster.intersectObject(plane);
        if (intersects.length > 0) {
            offset.copy(intersects[0].point).sub(plane.position);
        }
        container.style.cursor = 'move';
    }
}

function onDocumentMouseUp(event) {
    //deselects the SELECTED object
    event.preventDefault();
    controls.enabled = true;
    if (INTERSECTED) {
        plane.position.copy(INTERSECTED.position);

        // I'm a wild man, here I make a key for the obj movement tracker of the object to be the date
        // Needs to be selected.name or something but these guys dont have names yet
        if (objMovementTracker[SELECTED.id] == undefined) {
            objMovementTracker[SELECTED.id] = {};
        }
        objMovementTracker[SELECTED.id][new Date().toLocaleString()] = INTERSECTED.position;

        SELECTED = null;
    }
    container.style.cursor = 'auto';
}

function animate() {
    //animate function. threejs standard
    requestAnimationFrame(animate);
    render();
}

function render() {
    //render function. threejs standard
    controls.update();
    renderer.render(scene, camera);
    //makes labels follow stims. might be good later to just make labels children of stims (object.add(label) on create of stim
    updateLabels();
    //changes the background behind the canvas to the same color as the background of the canvas (there will be a bar at the top
    //of the screen that's off color
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgb(" + Math.round(boardTest.bgR) + ", " + Math.round(boardTest.bgG) + ", " + Math.round(boardTest.bgB) + ")"

}

function getTodaysDate(){
    //get today's date. This is used for the output stuff
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;
    return today;
}

function updateLabels() {
    //makes labels follow stims. might be good later to just make labels children of stims (object.add(label) on create of stim.
    //if the object is on the top half of the board, the labels need to be placed at a different spot than the labels of objects
    //on the bottom half of the board.
    //Labels are also put at different places on the left side of the screen, before they are put on the board
    for (var i = 0; i < objects.length; i++) {
        var offsetY;
        if (objects[i].onStimBoard) {
            objects[i].label.position.set(objects[i].position.x - 100, objects[i].position.y, objects[i].position.z);
        }
        else {
            if (objects[i].position.y > 0) {
                offsetY = 70;
            }
            else {
                offsetY = 100;
            }
            objects[i].label.position.set(objects[i].position.x + 35, objects[i].position.y + offsetY + labelPos, objects[i].position.z);
        }

    }
}

function createStimBoard() {
    //Stim Board. This is used to line up the stims on the left side of the screen and for easy movement
    var stim_geometry = new THREE.BoxGeometry(200, 20, 800);
    for (var i = 0; i < stim_geometry.faces.length; i += 2) {
        var stim_colo = "rgb(255, 255, 255)";
        stim_geometry.faces[i].color.set(new THREE.Color(stim_colo));
        stim_geometry.faces[i + 1].color.set(new THREE.Color(stim_colo));
    }
    var stim_material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, overdraw: 0.5});
    stim_board = new THREE.Mesh(stim_geometry, stim_material);
    stim_board.position.y = 0;
    stim_board.position.x = -windowHalfX + 100;
    stim_board.position.z = board.position.z - 100;
    stim_board.rotation.x = 1;
    scene.add(stim_board);
    stim_board.visible = false;
    board.position.x += 200;
    board.position.y -= 100;
}


function createViewStimuli() {
    //This is called when someone clicks "Launch Experiment". it sets up the next page
    info.innerHTML = '<p>Prompt</p>';
    //create new gui with a Finish Experiment button
    var view_stims = new dat.GUI();
    var stims = view_stims.addFolder('View Stimuli');
    stims.open();
    //create button to view stims
    var view = {
        viewStimuli: function () {
            viewStimuli();
        }
    };
    view_stims.add(view, 'viewStimuli');
    view_stims.domElement.style.position = 'absolute';
    view_stims.domElement.style.top = windowHalfY - 50 + 'px';
    view_stims.domElement.style.left = windowHalfX - 100 + 'px';
    view_stims.domElement.setAttribute('class', 'view_stims');

}

function viewStimuli() {
    //method that calls the method to view stims
    info.innerHTML = '<p>Experiment Preview</p>';

    document.getElementsByClassName('view_stims')[0].style.display = 'none';
    document.getElementsByClassName('draggable')[0].style.display = 'initial';

    createBeginExperiment();

}

function createBeginExperiment() {
    //makes the board visible again so you can view all your stimuli

    //create new gui with a Finish Experiment button
    var begin_gui = new dat.GUI();
    var begin = begin_gui.addFolder('Begin Experiment');
    begin.open();
    //begin experiment button
    var begin_exp = {
        beginExperiment: function () {
            createFinishExperiment();
        }
    };
    begin_gui.add(begin_exp, 'beginExperiment');
    begin_gui.domElement.style.position = 'absolute';
    begin_gui.domElement.style.top = window.innerHeight - 50 + 'px';
    begin_gui.domElement.style.left = windowHalfX - 100 + 'px';
    begin_gui.domElement.setAttribute('class', 'begin_gui');
    for (var i = 0; i < objects.length; i++){
        objects[i].position.x += 100;
    }
    board.position.x = 0;
    board.visible = true;


}

function centerStimsOnBoard() {
    //this centers stims on the stim board (to the left side of the screen)
    //the stim board is invisible, but used to line stims up easily
    for (var i = 0; i < objects.length; i++) {
        dummy.rotation.x = 0;
        objects[i].canMove = true;
        objects[i].onStimBoard = true;
        objects[i].position.x = stim_board.position.x - (i * 10) + 130;
        objects[i].position.y = stim_board.position.y + 350 - (i * 80);
        objects[i].position.z = stim_board.position.z + (i * 50);
        objects[i].label.rotation.x = -.5;


        // Probably shouldn't handle this here
        objMovementTracker[i] = objects[i];

    }
}

function createFinishExperiment() {
    //This is the function that sets up the actual experiement for running
    info.innerHTML = '<p>SOSA Modeling Experiment</p>';

    //create new gui with a Finish Experiment button
    document.getElementsByClassName('begin_gui')[0].style.display = 'none';
    camera.position.z += 200;
    camera.position.y += 100;
    createStimBoard();
    centerStimsOnBoard();
    var finish_gui = new dat.GUI();
    var finish = finish_gui.addFolder('Finish Experiment');
    finish.open();
    //create the finish experiement button.
    var finish_exp = {
        finishExperiment: function () {
            // Placeholder I need to pass in all my values
            finishExperiment(undefined, objMovementTracker, undefined, undefined);
        }
    };
    finish_gui.add(finish_exp, 'finishExperiment');
    finish_gui.domElement.setAttribute('class', 'finish_gui');

}

function finishExperiment(obj, movement, finalLocation, finalDistances) {
    //the function called when the user clicks "finish experiment"
    //This is where output of data happens
    console.log('Finished Experiment');

    var object = (obj !== undefined) ? obj : {};
    var stimMovement = (movement !== undefined) ? movement : {};
    var finalStimLocation = (finalLocation !== undefined) ? finalLocation : {};
    var finalStimDistances = (finalDistances !== undefined) ? finalDistances : {};


    for(var i = 0; i<objects.length; i++){

        finalStimLocation[i] = {};
        finalStimDistances[i] = {};
        finalStimLocation[i].x = objects[i].position.x;
        finalStimLocation[i].y = objects[i].position.y;

        // Cleans movement inside this loop for now
        if (typeof stimMovement[i] != object) {
            delete stimMovement[i];
        }

        for(var j = 1+i; j<objects.length; j++){
            //gets distance between points
            finalStimDistances[i]['distance to ' + j] = calculateDistance(objects[i], objects[j]);
        }
    }

    var output = {
        'Experiment Name': boardTest.Name,
        'Experiment Version': boardTest.Version,
        'Date': getTodaysDate(),
        'Stimuli': object,
        'Stimuli Movement': stimMovement,
        'Final Stimuli Location': finalStimLocation,
        'Final Stimuli Distances': finalStimDistances
    };
    console.log(output);

    var exportJSON = JSON.stringify(output);
    // Download solution from http://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON);
    var dlAnchorElem = document.getElementById('downloadHack');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "CompletedExperiment.json");
    dlAnchorElem.click();

    /*
     "Output": {
     "Experiment Name": "default name",
     "Experiment Version": "default version",
     "Date": "1/1/2016",
     "Stimuli": {
     "Stimulus Order":{
     "1": "Stimulus 1",
     "2": "Stimulus 3",
     "3": "Stimulus 2",
     "4": "Stimulus 5",
     "5": "Stimulus 4",
     */
    // What we want here:
    // A finished object containing timestamps and positions of all stimuli (his data)


    createThanks();
}

function createThanks() {
    document.getElementsByClassName('finish_gui')[0].style.display = 'none';
    info.innerHTML = '<p>Thanks for using SOSA!</p>';

    var thanks_gui = new dat.GUI();
    var thanks = thanks_gui.addFolder('Go Home');
    thanks.open();
    //create the redirect to home page button.
    var thanks_page = {
        goHome: function () {
            var index_link = document.createElement('a');
            index_link.setAttribute('href', 'index.html');
            index_link.click();
        }
    };
    thanks_gui.add(thanks_page, 'goHome');
    thanks_gui.domElement.setAttribute('class', 'thanks_gui');
    board.visible = false;
    dummy.visible = false;
    var t = document.getElementsByClassName('thanks_gui')[0];
    t.style.position = 'absolute';
    t.style.top = windowHalfY - 50 + 'px';
    t.style.left = windowHalfX - 100 + 'px';

}

function createGUI(){
    //used to create the GUI
    //Start GUI
    //GUI params
    var gui_controls = function () {
        this.Name = ' ';
        this.Version = ' ';
        //gui on the right side of the screen. run experiment settings
        this.rotationX = 1;
        this.boardR = 255;
        this.boardG = 255;
        this.boardB = 255;

        //sets the defaults
        this.setDefault = function () {
            boardTest.boardR = 255;
            boardTest.boardG = 255;
            boardTest.boardB = 255;
            board.material.color.setRGB(boardTest.boardR, boardTest.boardG, boardTest.boardB);
        };

        //set the board tilt to its default value
        this.boardTiltDefaults = function () {
            boardTest.rotationX = 1;
            board.rotation.x = 1;
            dummy.rotation.x = board.rotation.x - 1.2;

            for(var i = 0; i < objects.length; i++){
                objects[i].label.rotation.x = 1-board.rotation.x;
            }

        };

        this.bgR = 0;
        this.bgG = 0;
        this.bgB = 0;
        //set background to its default value
        this.backgroundDefaults = function () {
            boardTest.bgR = 0;
            boardTest.bgG = 0;
            boardTest.bgB = 0;
            document.getElementsByClassName('dg ac')[0].style.backgroundColor = bgColor;
            document.getElementsByTagName('body')[0].style.backgroundColor = bgColor;
            document.getElementById('myInput').style.backgroundColor = bgColor;
            document.getElementsByClassName('dg ac')[0].style.backgroundColor = bgColor;
            setBackgroundColor(boardTest);
            renderer.setClearColor(0x000000);

        };
        //this should be used later (not used yet) when we have functionality for an image on the back of the board
        //or a separate color for viewing of stims
        this.hasBG = true;

        this.import = function () {
            //import settings for experiment
            // Fires the click event on the invisible input
            document.getElementById("myInput").click();

            function readSingleFile(evt) {
                //reads settings from a file
                //Retrieve the first (and only!) File from the FileList object
                var file = evt.target.files[0];
                var contentsObj;

                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var contents = e.target.result;
                        try {
                            contentsObj = JSON.parse(contents);
                            preppedStim = contentsObj;
                            console.log(contentsObj);

                            updateBoard(boardTest, contentsObj);
                        }

                        catch (spookyScaryMonsterException) {
                            console.log('Your input file is in the wrong format.', spookyScaryMonsterException);
                        }
                    };
                    reader.readAsText(file);

                } else {
                    alert('Unable to load in a file.');
                }
            }
            document.getElementById('myInput').addEventListener('change', readSingleFile, false);

        };

        this.importStimSet = function() {

            console.log('hellloo');
            document.getElementById("myStimInput").click();

            function readSingleStimFile(evt) {
                console.log('click attempted');
                //Retrieve the first (and only!) File from the FileList object
                var file = evt.target.files[0];

                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var contents = e.target.result;
                        var contentsObj;
                        try {
                            contentsObj = JSON.parse(contents);

                            preppedStim = convertExperimentToThing(contentsObj);
                            makeStims(preppedStim);
                            // Test log
                            console.log(contentsObj);
                            console.log(preppedStim);
                        }

                        catch (spookyScaryMonsterException) {
                            console.log('Your input file is in the wrong format.');
                        }
                    };
                    reader.readAsText(file);
                } else {
                    alert('Unable to load in a file.');
                }
            }

            document.getElementById('myStimInput').addEventListener('change', readSingleStimFile, false);

        };

        this.export = function () {
            //saves the information in this gui to a JSON
            var exportJSON = JSON.stringify(this);
            // Download solution from http://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON);
            var dlAnchorElem = document.getElementById('downloadHack');
            dlAnchorElem.setAttribute("href",     dataStr     );
            dlAnchorElem.setAttribute("download", "experimentSettings.json");
            dlAnchorElem.click();


        };

        this.stimPlaceHolderFunc = function() {
            // Fires the click event on the invisible input
            document.getElementById("myInput").click();

            function readSingleFile(evt) {
                //Retrieve the first (and only!) File from the FileList object
                var file = evt.target.files[0];

                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var contents = e.target.result;
                        var contentsObj;
                        try {
                            contentsObj = JSON.parse(contents);
                            preppedStim = contentsObj;
                            makeStims(contentsObj);
                            // Test log
                            console.log(contentsObj);
                        }

                        catch (spookyScaryMonsterException) {
                            console.log('Your input file is in the wrong format.');
                        }
                    };
                    reader.readAsText(file);
                } else {
                    alert('Unable to load in a file.');
                }
            }
            document.getElementById('myInput').addEventListener('change', readSingleFile, false);

        };

        this.toggleLabels = function () {
        };

        this.labelUp = function() {};
        this.labelDown = function() {};
        this.labelShade = 1;
        this.labelSize = 20;
        this.labelR = 255;
        this.labelG = 0;
        this.labelB = 0;
        this.labelDefaults = function () {

        };

        this.outputLoc = function () {
        };

        //launch the experiment
        this.launchExperiment = function () {
            document.getElementsByClassName('dg main a')[0].style.display = 'none';
            document.getElementsByClassName('draggable')[0].style.display = 'none';
            board.visible = false;
            createViewStimuli();

        };
    };
    //GUI creation
    /*
     *	listen() on the gui panels allows the gui to react to outside input i.e. setDefault etc
     *	onChange() updates the scene based off gui values
     *
     */
    boardTest = new gui_controls();
    var gui = new dat.GUI();

    var experimentDetails = gui.addFolder('Experiment Details');
    experimentDetails.open();
    var experimentName = experimentDetails.add(boardTest, 'Name');
    var experimentVersion = experimentDetails.add(boardTest, 'Version');

    var appearance = gui.addFolder('Appearance');
    appearance.open();

    var boardAppearance = appearance.addFolder('Board1');
    boardAppearance.open();
    boardAppearance.add(boardTest, 'rotationX', -0.3, 1).listen().onChange(function () {

        board.rotation.x = (boardTest.rotationX);

        dummy.rotation.x = board.rotation.x - 1.2;

        for(var i = 0; i < objects.length; i++){
            objects[i].label.rotation.x = 1-board.rotation.x;
        }

    });
    boardAppearance.add(boardTest, 'boardR', 0, 255).listen().onChange(function () {
        setBoardColor(boardTest);
    });
    boardAppearance.add(boardTest, 'boardG', 0, 255).listen().onChange(function () {
        setBoardColor(boardTest);
    });
    boardAppearance.add(boardTest, 'boardB', 0, 255).listen().onChange(function () {
        setBoardColor(boardTest);
    });
    boardAppearance.add(boardTest, 'setDefault');
    boardAppearance.add(boardTest, 'boardTiltDefaults');

    var backgroundAppearance = appearance.addFolder('Background');
    backgroundAppearance.open();
    backgroundAppearance.add(boardTest, 'bgR', 0, 255).listen().onChange(function () {
        setBackgroundColor(boardTest);
    });
    backgroundAppearance.add(boardTest, 'bgG', 0, 255).listen().onChange(function () {
        setBackgroundColor(boardTest);
    });
    backgroundAppearance.add(boardTest, 'bgB', 0, 255).listen().onChange(function () {
        setBackgroundColor(boardTest);
    });
    backgroundAppearance.add(boardTest, 'backgroundDefaults');

    var settingsIO = gui.addFolder('Import/Export Settings');
    settingsIO.open();
    settingsIO.add(boardTest, 'import');
    settingsIO.add(boardTest, 'importStimSet');
    settingsIO.add(boardTest, 'export');

    var labels = gui.addFolder('Labels');
    labels.open();
    labels.add(boardTest, 'toggleLabels').listen().onChange(function(){
        toggleLabels(boardTest);
    });
    labels.add(boardTest, 'labelUp').listen().onChange(function(){
        for (var i = 0; i < objects.length; i++) {
            labelPos += .5;
        }
    });
    labels.add(boardTest, 'labelDown').listen().onChange(function(){
        for (var i = 0; i < objects.length; i++) {
            labelPos -= .5;
        }
    });
    labels.add(boardTest, 'labelR', 0, 255).listen().onChange(function () {
        setLabelColor(boardTest);
    });
    labels.add(boardTest, 'labelG', 0, 255).listen().onChange(function () {
        setLabelColor(boardTest);
    });
    labels.add(boardTest, 'labelB', 0, 255).listen().onChange(function () {
        setLabelColor(boardTest);
    });
    labels.add(boardTest, 'labelShade', 0, 1).step(.01).listen().onChange(function () {
        setLabelColor(boardTest);
    });
    labels.add(boardTest, 'labelSize', 6, 32).listen().onChange(function () {
        setLabelSize(boardTest);
    });
    labels.add(boardTest, 'labelDefaults').listen().onChange(function () {
        setLabelDefaults(boardTest);
    });

    var outputLocation = gui.addFolder('Log Output Location');
    outputLocation.open();
    outputLocation.add(boardTest, 'outputLoc');

    var launchExperiment = gui.addFolder('Launch Experiment');
    launchExperiment.open();
    launchExperiment.add(boardTest, 'launchExperiment');
    //END GUI
}

// Handle the listbox that will contain stimuli
// Read in the file instead of using this darn sample
function readExperimentFromFile(fname) {

    // Variable initialization

    // Checks to ensure that the file is in the correct format
    console.log('just kidding ', fname);

    // Converts file to JSON
    console.log('currently already JSON heya');

    // Turns JSON to object
    var asObject;

    try {
        asObject = JSON.parse(fname);
    }

    catch (spookyScaryMonsterException) {
        asObject = fname;
    }
    return asObject;

}

// Create an object containing objects for each order.
// Should not be named this
function convertExperimentToThing(fname) {

    // Variable initialization
    var experiment = readExperimentFromFile(fname);
    var preppedStim = [];

    // Determine our order
    console.log('for now Im just assuming the first order');
    if (experiment.orders) {
        var order = experiment.orders.order1;
    }

    // Organize our stimuli based on our selected order
    for (var i = 0; i < order.length; i++) {

        var key = order[i];

        if (key in experiment.stimuli) {
            preppedStim[i] = experiment.stimuli[key];
        }
    }

    return preppedStim;
}

function makeStims(stimuli) {
    //create stims
    console.log(stimuli);
    for (var i = 0; i < stimuli.length; i++) {

        // create box
        var geometry_box = new THREE.BoxGeometry(40, 40, 40);
        //This does images --- was not working for me on 4-10-16
        //var object = new THREE.Mesh(geometry_box, new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(stimuli[i].Image)}));
        var stimMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var object = new THREE.Mesh(geometry_box, stimMat);
        var labelYoffset;

        object.castShadow = true;
        object.receiveShadow = true;
        objects.canMove = false;

        //each stim has a different position on the board. This is the algorithm that makes sure they're in the right place
        if (i >= 0 && i <= 2) {
            object.position.x = board.position.x + (i * 300) - 300;
            object.position.y = board.position.y + 200;
            object.position.z = board.position.z - 30;
            labelYoffset = 60;
        }

        else if (i >= 3 && i <= 5) {
            object.position.x = board.position.x + ((i - 4) * 300);
            object.position.y = board.position.y;
            object.position.z = board.position.z + 30;
            labelYoffset = 75;
        }
        else if (i >= 6 && i <= 8) {
            object.position.x = board.position.x + ((i - 7) * 300);
            object.position.y = board.position.y - 150;
            object.position.z = board.position.z + 110;
            labelYoffset = 20;
        }
        object.rotation.x = board.rotation.x + 1;
        object.onStimBoard = false;
        scene.add(object);
        //create a label for the stim
        makeLabel(stimuli, object, i);
        //make sure the object rotates when dummy rotates. dummy rotates with the board. This keeps them on the board while rotating
        dummy.add(object);
    }

}

function makeLabel(stims, obj, count){
    //MAKE LABELS
    //would be good to make these labels children of their objects later so they follow more easily.

    //these labels cover each other up. I've made them as small as possible so they cover each other up as
    //little as possible, but that means on the highest font size, labels can only have up to 7 characters
    //or risk getting cut off.
    //The z-indexes are the problem here. Since each stim is specifically placed, their z-indexes are different.
    //The canvas elements are rectangular with a margin around the words and even if I set their backgrounds to transparent
    //I could only get it to turn the same color as the board. If you can figure it out, you're cool

    // create a canvas element
    var canvaslabel = document.createElement('canvas');
    var contextlabel = canvaslabel.getContext('2d');

    canvaslabel.width = 125;
    canvaslabel.height = 50;

    contextlabel.clearRect(0, 0, 125, 50);
    contextlabel.font = "Bold 20px Arial";
    contextlabel.fillStyle = labelColor;


    wrapText(contextlabel, "Stim #" + (count+1), 0, 50, 125, 20);
    context1.push(contextlabel);
    canvas1.push(canvaslabel);


    // canvas contents will be used for a texture
    var texture1 = new THREE.Texture(canvaslabel);
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
    material1.transparent = true;

    var label = new THREE.Mesh(
        new THREE.PlaneGeometry(canvaslabel.width, canvaslabel.height),
        material1
    );
    label.position.set(obj.position.x - 130, obj.position.y + 10, obj.position.z);
    label.rotation.x = .5;
    scene.add(label);
    //this might should be obj.add(label), but you'd have to play with it. labels may be positioned weird so if you do
    //obj.add(label), you may need to play with this positioning
    obj.label = label;
    //labels should rotate with the board
    dummy.add(label);
    objects.push(obj);
}

function overwriteLabel(count){
    //This draws white over the label so we can do things like change color or size. Its a canvas, so we can't just change
    //some sort of "text" attribute or something, we actually have to write it
    context1[count].fillStyle = boardColor = "rgba(" + Math.round(boardTest.boardR) + ", " + Math.round(boardTest.boardG) + ", " + Math.round(boardTest.boardB) + ", " + boardTest.labelShade + ")";
    context1[count].clearRect(0, 0, 125, 50);
    labelTexture = new THREE.Texture(canvas1[count]);
    labelTexture.needsUpdate = true;
    objects[count].label.material.map = labelTexture;
    wrapText(context1[count], "Stim #" + (count+1), 0, 50, 125, 20);
}

function updateBoard(b, obj) {
    //updates the board with the proper settings from the gui
    console.log(b);
    console.log(obj);

    //updates the gui
    b.bgB = obj.bgB;
    b.bgG = obj.bgG;
    b.bgR = obj.bgR;
    b.boardB = obj.boardB;
    b.boardG = obj.boardG;
    b.boardR = obj.boardR;
    b.hasBG = obj.hasBG;
    b.labelB = obj.labelB;
    b.labelG = obj.labelG;
    b.labelR = obj.labelR;
    b.labelShade = obj.labelShade;
    b.labelSize = obj.labelSize;
    b.rotationX = obj.rotationX;

    // Handles boardR, boardG, and boardB
    setBackgroundColor(b);

    // Handles bgR, bgG, and bgB
    setBoardColor(b);

    // Handles labelR, labelG, labelB, and labelShade
    setLabelColor(b);

    // Handles labelSize
    setLabelSize(b);

    // Handles rotationX
    board.rotation.x = (b.rotationX);

    dummy.rotation.x = board.rotation.x - 1.2;

    for(var i = 0; i < objects.length; i++){
        objects[i].label.rotation.x = 1-board.rotation.x;
    }


}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    //makes text in the labels' canvases wrap to the next line. might be unnecessary
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function setBoardColor(gui){
    //set board color to the gui's value
    boardColor = "rgb(" + Math.round(gui.boardR) + ", " + Math.round(gui.boardG) + ", " + Math.round(gui.boardB) + ")";
    board.material.color.set(new THREE.Color(boardColor));
}

function setBackgroundColor(gui){
    //set background color to the gui's value
    bgColor = "rgb(" + Math.round(gui.bgR) + ", " + Math.round(gui.bgG) + ", " + Math.round(gui.bgB) + ")";
    renderer.setClearColor(new THREE.Color(bgColor));
}

function setLabelColor(gui){
    //set label coolor to the gui's value
    if(labelsShowing == true){
        labelSize = gui.labelSize + "px";
        labelColor = "rgba(" + Math.round(gui.labelR) + ", " + Math.round(gui.labelG) + ", " + Math.round(gui.labelB) + ", " + gui.labelShade + ")";
        for (var i = 0; i < objects.length; i++) {
            overwriteLabel(i);
            context1[i].font = 'Bold ' + labelSize + ' Arial';
            context1[i].fillStyle = labelColor;
            labelTexture = new THREE.Texture(canvas1[i]);
            labelTexture.needsUpdate = true;
            objects[i].label.material.map = labelTexture;
            wrapText(context1[i], "Stim #" + (i+1), 0, 50, 125, 20);
        }
    }
    labelsChanged = true;
}

function setLabelSize(gui){
    //overwrite the label, set it to the font size the gui says to
    if(labelsShowing == true){
        labelSize = gui.labelSize + "px";
        labelColor = "rgba(" + Math.round(gui.labelR) + ", " + Math.round(gui.labelG) + ", " + Math.round(gui.labelB) + ", " + gui.labelShade + ")";

        for(var i = 0; i < objects.length; i++){
            overwriteLabel(i);
            context1[i].font = 'Bold ' + labelSize + ' Arial';
            context1[i].fillStyle = labelColor;
            labelTexture = new THREE.Texture(canvas1[i]);
            labelTexture.needsUpdate = true;
            objects[i].label.material.map = labelTexture;
            wrapText(context1[i], "Stim #" + (i+1), 0, 50, 125, 20);
        }
    }
    labelsChanged = true;
}

function setLabelDefaults(gui) {
    //overwrite the label, set it to the font size the gui says to
    labelsShowing = true;
    labelSize = "20px";
    labelColor = "rgba(255, 0, 0, 1)";

    gui.labelR = 255;
    gui.labelG = 0;
    gui.labelB = 0;
    gui.labelShade = 1;
    gui.labelSize = 20;

    for(var i = 0; i < objects.length; i++){
        context1[i].font = 'Bold ' + labelSize + ' Arial';
        context1[i].fillStyle = labelColor;
        labelTexture = new THREE.Texture(canvas1[i]);
        labelTexture.needsUpdate = true;
        objects[i].label.material.map = labelTexture;
        wrapText(context1[i], "Stim #" + (i+1), 0, 50, 125, 20);
    }
    labelsChanged = true;

}

function toggleLabels(gui){
    //make labels visible/invisible
    for (var i = 0; i < objects.length; i++){
        objects[i].label.visible = !objects[i].label.visible;
        labelsShowing = !labelsShowing;
    }

}

function calculateDistance(point1, point2){
    //calculate distances between two stims
    var xDiff = (point2.position.x - point1.position.x);
    var yDiff = (point2.position.y - point1.position.y);
    var distance = Math.round(Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));
    return distance;
}
init();
animate();
