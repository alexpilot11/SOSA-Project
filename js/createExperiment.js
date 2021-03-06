//global vars
var container;
var camera, scene, renderer;
var stim;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var count = 0;

var stimColor;
var bgColor;

var stimGui, stimTest;

var stimSet = {};
var currentKey;

//Scene setup
function init() {
    //container for everything
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //section at the top with the title
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = '#ffffff';
    info.innerHTML = 'Create Stimulus';
    container.appendChild( info );

    //camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    //scene. Everything is added to this to show up in the html
    scene = new THREE.Scene();

    //stim
    //This is the object that is in the middle for a preview of the stim being edited
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var colo =  "rgb(255, 255, 255)";
        geometry.faces[ i ].color.set(new THREE.Color(colo));
        geometry.faces[ i + 1 ].color.set(new THREE.Color(colo));
    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    stim = new THREE.Mesh( geometry, material );
    stim.position.y = 200;
    stim.rotation.x = .5;
    scene.add( stim );

    //Renderer
    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //creates the gui
    createGui();

    //Resize event listener
    window.addEventListener( 'resize', onWindowResize, false );


}

//This resizes things for different stim sizes. Might be good to make it scale things later
//This isn't as much used in this doc as it is in the runExperiment
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//animate. Three.js standard
function animate() {
    requestAnimationFrame( animate );
    render();

}

//render. Three.js standard
function render() {
    renderer.render( scene, camera );
}



//Start GUI
//GUI params
/*
 *
 *	To add items to the GUI
 *	First add to the controls var
 *	Then add it to the gui in the gui creation section
 *	Then add onClick/onChange functionality as desired
 *
 */

function createGui() {
    var controls = function() {
        //gui on the right to control the stim and set settings for it

        this.stimName = 'stimName';
        this.stimLabel = 'stimLabel';

        this.rotationX = 1;

        this.bgR = 0;
        this.bgG = 0;
        this.bgB = 0;

        this.stimR = 255;
        this.stimG = 255;
        this.stimB = 255;

        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;

        this.imageName = '';
        this.uploadImage = function() {
            var input = document.getElementById('img-path');
            input.addEventListener('change', function() {
                var file = input.files[0];
                stimTest.imageName = file.name;
            });
            input.click();
        };

        this.add = function(){
        };

        this.save = function(){
        };

        this.backToHome = function(){
        };

    };

    //GUI creation
    /*
     *	listen() on the gui panels allows the gui to react to outside input i.e. setDefault etc
     *	onChange() updates the scene based off gui values
     *
     *
     *	An Example addition to the gui
     *
     *	scale.add(stimTest, ).listen().onChange( function(){
     *	});
     */

    //The variables object for the gui
    stimTest = new controls();

    //The gui object
    var gui = new dat.GUI();

    //left gui. this is the list of stims that have been created
    var stimGuiControls = function(){
        this.stim = 25;
        this.stimList = [];
        this.stimJSONString = [];
    };

    stimGui = new stimGuiControls();
    var guiLeft = new dat.GUI();
    guiLeft.domElement.style.position = 'absolute';
    guiLeft.domElement.style.float = 'left';

    //var stimHeader = guiLeft.addFolder('Current Stimuli');
    guiLeft.add(stimGui, 'stimList', []);
//                        .listen().onChange( function(){
//					console.log('stimList Changed');
//				});

    //all gui functionality
    var stimName = gui.addFolder('Stim Name');
    gui.add(stimTest, 'stimName');

    var rotate = gui.addFolder('Rotate');
    rotate.open();
    rotate.add(stimTest, 'rotationX', -3.14, 3.14).listen().onChange( function(){
        stim.rotation.x = (stimTest.rotationX);
    });

    var backgroundAppearance = gui.addFolder('Background');
    backgroundAppearance.open();
    backgroundAppearance.add(stimTest, 'bgR', 0, 255).listen().onChange( function(){
        setBackgroundColor(stimTest);
    });
    backgroundAppearance.add(stimTest, 'bgG', 0, 255).listen().onChange( function(){
        setBackgroundColor(stimTest);
    });
    backgroundAppearance.add(stimTest, 'bgB', 0, 255).listen().onChange( function(){
        setBackgroundColor(stimTest);
    });

    var color = gui.addFolder('Color');
    color.open();
    color.add(stimTest, 'stimR', 0, 255).listen().onChange( function(){
        setStimColor(stimTest);
    });
    color.add(stimTest, 'stimG', 0, 255).listen().onChange( function(){
        setStimColor(stimTest);
    });
    color.add(stimTest, 'stimB', 0, 255).listen().onChange( function(){
        setStimColor(stimTest);
    });

    var size = gui.addFolder('Size');
    size.open();
    size.add(stimTest, 'sizeX', 1, 3).step(.01).listen().onChange( function(){
        setStimSize(stimTest);


    });
    size.add(stimTest, 'sizeY', 1, 3).step(.01).listen().onChange( function(){
        setStimSize(stimTest);


    });
    size.add(stimTest, 'sizeZ', 1, 3).step(.01).listen().onChange( function(){
        setStimSize(stimTest);

    });

    var image = gui.addFolder('Image');
    image.open();
    image.add(stimTest, 'imageName', stimTest.imageName).listen();
    image.add(stimTest, 'uploadImage');

    var add = gui.addFolder('Add');
    add.open();
    //add stim button. saves the stim info
    add.add(stimTest, 'add').listen().onChange(function () {

        // Object size solution from http://stackoverflow.com/questions/5223/length-of-a-javascript-object-that-is-associative-array
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // Get the size of an object
        var size = Object.size(stimSet);
        if (size < 9) {
            var newStim = stimTest.stimName.substring(0, 10);
            var isThere = false;
            var isThereIndex = -1;

            for (var i = 0; i < stimGui.stimJSONString.length; i++) {
                var parse = JSON.parse(stimGui.stimJSONString[i]);
                if (parse.name == stimTest.stimName.substring(0, 10)) {
                    isThere = true;
                    isThereIndex = i;
                    break;
                }
            }

            if(typeof stimSet[newStim] === 'undefined') {
                stimSet[newStim] = {
                    'Name': newStim
                };
            }

            updateDropdown(guiLeft);
            setDataString(stimTest, isThere, isThereIndex);
            setDefaults(stimTest);
        }
        else {
            alert("Only 9 stims may be created.");
        }
    });

    //saves the information from the stims as JSON to user's computer
    var save = gui.addFolder('Save');
    save.open();
    save.add(stimTest, 'save').onChange(function(){
        // save stuff as a json

        var stimNames = [];
        for (var key in stimSet) {
            if (stimSet.hasOwnProperty(key)) stimNames.push(key);
        }

        // This is not the ideal fix for this bug... ---------------------------------------------

        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // Get the size of an object
        var inc = 0;
        var size = Object.size(stimSet);

        while (inc < size) {

            var parse = JSON.parse(stimGui.stimJSONString[inc]);
            currentKey = parse.name;

            // Check to ensure the stim with this key exists
            if(typeof stimSet[currentKey] === 'undefined') {
                stimSet[currentKey] = {};
            }

            stimSet[currentKey].stimName = parse.name.substring(0, 10);
            stimSet[currentKey].stimR = parse.r;
            stimSet[currentKey].stimG = parse.g;
            stimSet[currentKey].stimB = parse.b;
            stimSet[currentKey].sizeX = parse.sizeX;
            stimSet[currentKey].sizeY = parse.sizeY;
            stimSet[currentKey].sizeZ = parse.sizeZ;
            stimSet[currentKey].bgR = parse.bgR;
            stimSet[currentKey].bgG = parse.bgG;
            stimSet[currentKey].bgB = parse.bgB;

            inc++;
        }


        // End not ideal fix ----------------------------------------------------------------------

        var exportObject = {
            'orders': {
                'order1': stimNames
            },
            'stimuli': stimSet
        };

        var exportJSON = JSON.stringify(exportObject);
        // Download solution from http://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON);
        var dlAnchorElem = document.getElementById('downloadHack');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "StimSet.json");
        dlAnchorElem.click();
        // prompt user to make another stim set or go to
        // run page

    });

    //takes the user back to the home page where they can either run the experiment or create a stim set
    var backToHome = gui.addFolder('Back to Home');
    backToHome.open();
    backToHome.add(stimTest, 'backToHome').onChange(function(){
        var a = confirm("You will lose changes! Are you sure you want to do this?");
        if (a) {
            var index_link = document.createElement('a');
            index_link.setAttribute('href', 'index.html');
            index_link.click();
        }
    });

    function updateDropdown(guiLeft) {
        //updates the left gui. called by the add button
        guiLeft.__controllers[0].remove();

        // Grab all of the keys (stim names) from our stimset
        var stimNames = [];
        for (var key in stimSet) {
            if (stimSet.hasOwnProperty(key)) stimNames.push(key);
        }

        guiLeft.add(stimGui, "stimList", stimNames).listen().onChange(function () {
            var index = document.getElementsByTagName('select')[0].selectedIndex;
            var parse = JSON.parse(stimGui.stimJSONString[index]);

            currentKey = parse.name;

            // Check to ensure the stim with this key exists
            if(typeof stimSet[currentKey] === 'undefined') {
                stimSet[currentKey] = {};
            }

            stimSet[currentKey].stimName = parse.name.substring(0, 10);
            stimSet[currentKey].stimR = parse.r;
            stimSet[currentKey].stimG = parse.g;
            stimSet[currentKey].stimB = parse.b;
            stimSet[currentKey].sizeX = parse.sizeX;
            stimSet[currentKey].sizeY = parse.sizeY;
            stimSet[currentKey].sizeZ = parse.sizeZ;
            stimSet[currentKey].bgR = parse.bgR;
            stimSet[currentKey].bgG = parse.bgG;
            stimSet[currentKey].bgB = parse.bgB;

            setStimColor(stimSet[currentKey]);
            setStimSize(stimSet[currentKey]);
            setBackgroundColor(stimSet[currentKey]);
        });
    }



    function setDataString(gui, isThere, index){
        //saves information to the stimJSONString which is used on save
        if(isThere && index != -1){
            stimGui.stimJSONString[index] = JSON.stringify({
                index: index,
                name: gui.stimName.substring(0, 10),
                r: Math.round(gui.stimR),
                g: Math.round(gui.stimG),
                b: Math.round(gui.stimB),
                sizeX: gui.sizeX,
                sizeY: gui.sizeY,
                sizeZ: gui.sizeZ,
                bgR: gui.bgR,
                bgG: gui.bgG,
                bgB: gui.bgB,
                image: ''
            })
        }
        else {
            stimGui.stimJSONString.push(JSON.stringify(
                {
                    index: count,
                    name: gui.stimName.substring(0, 10),
                    r: Math.round(gui.stimR),
                    g: Math.round(gui.stimG),
                    b: Math.round(gui.stimB),
                    sizeX: gui.sizeX,
                    sizeY: gui.sizeY,
                    sizeZ: gui.sizeZ,
                    bgR: gui.bgR,
                    bgG: gui.bgG,
                    bgB: gui.bgB,
                    image: ''
                }));
            count++;
        }
    }

}

function setStimColor(gui){
    //set stim color to the value of the right gui
    stimColor = "rgb("+Math.round(gui.stimR)+", "+Math.round(gui.stimG)+", "+Math.round(gui.stimB)+")";
    stim.material.color.set(new THREE.Color(stimColor));
}

function setBackgroundColor(gui){
    //set background color to the value of the right gui. This is for viewing the stim with the expected background
    //because background can be changed later. In the future it would be good to implement a way to lock the background color
    //from the stim creation screen and not be able to edit it in the runExperiment screen
    bgColor = "rgb("+Math.round(gui.bgR)+", "+Math.round(gui.bgG)+", "+Math.round(gui.bgB)+")";
    renderer.setClearColor(new THREE.Color(bgColor));
}

function setStimSize(gui){
    //set the stim size with the right gui's value
    stim.scale.x = gui.sizeX;
    stim.scale.y = gui.sizeY;
    stim.scale.z = gui.sizeZ;
}

function setDefaults(gui){
    //set everything to the default value of the right gui
    stimColor = "rgb(255,255,255)";
    stim.material.color.set(new THREE.Color(stimColor));
    bgColor = "rgb(0,0,0)";
    renderer.setClearColor(new THREE.Color(bgColor));
    stim.scale.x = 1;
    stim.scale.y = 1;
    stim.scale.z = 1;
    gui.stimName = "stimName";
    gui.stimR = 255;
    gui.stimG = 255;
    gui.stimB = 255;
    gui.sizeX = 1;
    gui.sizeY = 1;
    gui.sizeZ = 1;
    gui.bgR = 0;
    gui.bgG = 0;
    gui.bgB = 0;
}

init();
animate();
//END GUI
