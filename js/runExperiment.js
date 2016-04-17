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
//Sample JSON
var importJSON = {
    orders: {
        order1: ['Stimulus1', 'Stimulus2', 'Stimulus3', 'Stimulus4', 'Stimulus5', 'Stimulus6', 'Stimulus7', 'Stimulus8', 'Stimulus9'],
        order2: ['Stimulus5', 'Stimulus4', 'Stimulus3', 'Stimulus2', 'Stimulus1'],
        order3: ['Stimulus2', 'Stimulus3', 'Stimulus1', 'Stimulus4', 'Stimulus5']
    },

    stimuli: {
        Stimulus1: {
            Name: 'StimDefault1',
            Image: 'img/test1.png',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus2: {
            Name: 'StimDefault2',
            Image: 'img/test2.png',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus3: {
            Name: 'StimDefault3',
            Image: 'img/test3.png',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus4: {
            Name: 'StimDefault4',
            Image: 'img/test4.jpg',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus5: {
            Name: 'StimDefault5',
            Image: 'img/test5.jpg',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus6: {
            Name: 'StimDefault5',
            Image: 'img/test5.jpg',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus7: {
            Name: 'StimDefault5',
            Image: 'img/test5.jpg',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus8: {
            Name: 'StimDefault5',
            Image: 'img/test5.jpg',
            sizeX: '300px',
            sizeY: '300px'
        },
        Stimulus9: {
            Name: 'StimDefault5',
            Image: 'img/test5.jpg',
            sizeX: '300px',
            sizeY: '300px'
        }

    }
};

//Scene setup
function init() {

    container = document.createElement('div');
    container.setAttribute('class', 'draggable');
    document.body.appendChild(container);

    info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = '#FFFFFF';
    info.innerHTML = '<p>Preview Experiment</p>';
    container.appendChild(info);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;
    camera.position.y = 515;
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 0.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x505050));
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

    dummy = new THREE.Object3D();
    dummy.rotation.x = board.rotation.x - 1;
    scene.add(dummy);


    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
        new THREE.MeshBasicMaterial({visible: false})
    );
    scene.add(plane);

    createGUI();
    var preppedStim = convertExperimentToThing(importJSON);
    makeStims(preppedStim);


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
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (SELECTED) {
        var intersects_board = raycaster.intersectObject(board);
        if (intersects_board.length > 0 && SELECTED.canMove) {
            SELECTED.onStimBoard = false;
            SELECTED.position.copy(intersects_board[0].point.sub(offset));
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
    requestAnimationFrame(animate);
    render();
}

function render() {
    controls.update();
    renderer.render(scene, camera);
    updateLabels();
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgb(" + Math.round(boardTest.bgR) + ", " + Math.round(boardTest.bgG) + ", " + Math.round(boardTest.bgB) + ")"

}

function getTodaysDate(){
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
    //Stim Board
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
    info.innerHTML = '<p>Prompt</p>';
    //create new gui with a Finish Experiment button
    var view_stims = new dat.GUI();
    var stims = view_stims.addFolder('View Stimuli');
    stims.open();
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
    info.innerHTML = '<p>Experiment Preview</p>';

    document.getElementsByClassName('view_stims')[0].style.display = 'none';
    document.getElementsByClassName('draggable')[0].style.display = 'initial';

    createBeginExperiment();

}

function createBeginExperiment() {

    //create new gui with a Finish Experiment button
    var begin_gui = new dat.GUI();
    var begin = begin_gui.addFolder('Begin Experiment');
    begin.open();
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
    var finish_exp = {
        finishExperiment: function () {
            // Placeholder I need to pass in all my values
            finishExperiment(undefined, objMovementTracker, undefined, undefined);
        }
    };
    finish_gui.add(finish_exp, 'finishExperiment');

}

function finishExperiment(obj, movement, finalLocation, finalDistances) {
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
        'Experiment Name': 'Test name',
        'Experiment Version': 'Test version',
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
};

function createGUI(){
    //Start GUI
    //GUI params
    var gui_controls = function () {
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
        this.hasBG = true;

        this.import = function () {
            // Fires the click event on the invisible input
            document.getElementById("myInput").click();

            function readSingleFile(evt) {
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

        this.export = function () {

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
    });;
    labels.add(boardTest, 'labelDefaults');

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
        object.rotation.x = board.rotation.x;
        object.onStimBoard = false;
        scene.add(object);
        makeLabel(stimuli, object, i);
        dummy.add(object);
    }

}

function makeLabel(stims, obj, count){
    //MAKE LABELS
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
    label.rotation.x = -.5;
    scene.add(label);
    obj.label = label;
    dummy.add(label);
    objects.push(obj);
}

function overwriteLabel(count){
    context1[count].fillStyle = boardColor = "rgba(" + Math.round(boardTest.boardR) + ", " + Math.round(boardTest.boardG) + ", " + Math.round(boardTest.boardB) + ", " + boardTest.labelShade + ")";
    context1[count].clearRect(0, 0, 125, 50);
    labelTexture = new THREE.Texture(canvas1[count]);
    labelTexture.needsUpdate = true;
    objects[count].label.material.map = labelTexture;
    wrapText(context1[count], "Stim #" + (count+1), 0, 50, 125, 20);
}

function updateBoard(b, obj) {
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
    boardColor = "rgb(" + Math.round(gui.boardR) + ", " + Math.round(gui.boardG) + ", " + Math.round(gui.boardB) + ")";
    board.material.color.set(new THREE.Color(boardColor));
}

function setBackgroundColor(gui){
    bgColor = "rgb(" + Math.round(gui.bgR) + ", " + Math.round(gui.bgG) + ", " + Math.round(gui.bgB) + ")";
    renderer.setClearColor(new THREE.Color(bgColor));
}

function setLabelColor(gui){
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

function toggleLabels(gui){
    // if the labels are not showing

    for (var i = 0; i < objects.length; i++){
        objects[i].label.visible = !objects[i].label.visible
    }
}

function calculateDistance(point1, point2){
    var xDiff = (point2.position.x - point1.position.x);
    var yDiff = (point2.position.y - point1.position.y);
    var distance = Math.round(Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));
    return distance;
}
init();
animate();