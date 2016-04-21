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

// My goal:
// - Combine stimNamesList and stimTest under a different, more suitable name
// - Enable saving of a bunch of stims, exporting them into a file that uses the same format as what is imported in run

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
            var newStim = stimTest.stimName;
            var isThere = false;
            var isThereIndex = -1;

            for (var i = 0; i < stimGui.stimJSONString.length; i++) {
                var parse = JSON.parse(stimGui.stimJSONString[i]);
                if (parse.name == stimTest.stimName) {
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
        // prompt user to make another stim set or go to
        // run page

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
            console.log(stimTest.stimName);
            stimTest.stimName = parse.name;
            stimTest.stimR = parse.r;
            stimTest.stimG = parse.g;
            stimTest.stimB = parse.b;
            stimTest.sizeX = parse.sizeX;
            stimTest.sizeY = parse.sizeY;
            stimTest.sizeZ = parse.sizeZ;
            stimTest.bgR = parse.bgR;
            stimTest.bgG = parse.bgG;
            stimTest.bgB = parse.bgB;
            setStimColor(stimTest);
            setStimSize(stimTest);
            setBackgroundColor(stimTest);
        });
    }



    function setDataString(gui, isThere, index){
        //saves information to the stimJSONString which is used on save
        if(isThere && index != -1){
            stimGui.stimJSONString[index] = JSON.stringify({
                index: index,
                name: gui.stimName,
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
                    name: gui.stimName,
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
