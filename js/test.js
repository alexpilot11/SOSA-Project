//---QUESTIONABLE---
QUnit.test( "init", function( assert ) {
	assert.equal( info.style.position, 'absolute', "Passed" );
	assert.equal( info.style.top, '10px', "Passed");
	assert.equal( info.style.width, '100%', "Passed");
	assert.equal( info.style.textAlign,'center', "Passed");
	assert.equal( info.style.color,'rgb(255, 255, 255)', "Passed"); //DFC
	assert.equal( info.innerHTML,'<p>Preview Experiment</p>', "Passed");

	assert.equal( camera.position.z, 800, "Passed");
	assert.equal( camera.position.y, 515, "Passed");

	assert.equal( controls.rotateSpeed, 0.0, "Passed");
	assert.equal( controls.zoomSpeed, 1.2, "Passed");
	assert.equal( controls.panSpeed, 0.8,"Passed");
	assert.equal( controls.noZoom, false, "Passed");
	assert.equal( controls.noPan, false, "Passed");
	assert.equal( controls.staticMoving, true, "Passed");
	assert.equal( controls.dynamicDampingFactor, 0.3, "Passed");

	// -- "light is not defined" --
	// assert.equal( light.castShadow, true, "Passed");
	// assert.equal( light.shadowCameraNear, 200, "Passed");
	// assert.equal( light.shadowCameraFar, camera.far, "Passed");
	// assert.equal( light.shadowCameraFov, 50, "Passed");
	// assert.equal( light.shadowBias, -0.00022, "Passed");
	// assert.equal( light.shadowMapWidth, 2048, "Passed");
	// assert.equal( light.shadowMapHeight, 2048, "Passed");

	assert.equal( board.position.y, 0, "Passed");
	assert.equal( board.position.x, -100, "Passed");
	assert.equal( board.rotation.x, 1, "Passed");
	assert.equal( board.visible, true, "Passed");
	assert.equal( dummy.rotation.x, board.rotation.x - 1, "Passed");

	assert.equal( renderer.sortObjects , false, "Passed");
	assert.equal( renderer.shadowMap.enabled , true, "Passed");
	assert.equal( renderer.shadowMap.type , THREE.PCFShadowMap, "Passed");
});

//---REQUIRE USER INPUT---
QUnit.test( "onWindowResize", function( assert ) {
	assert.equal( windowHalfX, window.innerWidth / 2, "Passed" );
	assert.equal( windowHalfY, window.innerHeight / 2, "Passed" );

	assert.equal( camera.aspect, window.innerWidth / window.innerHeight, "Passed" );
});
QUnit.test( "onDocumentMouseMove", function( assert ) {
	assert.ok( true, "Not Done" );
	// --These tests require user input (i.e. 'event') and have local variables, will try to fix later--
	// assert.equal( mouse.x, ( event.clientX / window.innerWidth ) * 2 - 1, "Passed" );
	// assert.equal( mouse.y, -( event.clientY / window.innerHeight ) * 2 + 1, "Passed" );
	// assert.equal( intersects_board, raycaster.intersectObject(board), "Passed" );
});
QUnit.test( "onDocumentMouseDown", function( assert ) {
	assert.ok( true, "Not Done" );
	// --These tests require user input (i.e. 'event') and have local variables, will try to fix later--
});
QUnit.test( "onDocumentMouseUp", function( assert ) {
	assert.ok( true, "Not Done" );
	// --These tests require user input (i.e. 'event') and have local variables, will try to fix later--
});

//done, three js
QUnit.test( "animate", function( assert ) {
	assert.ok( true, "Not Done" );
});

//done, three js
QUnit.test( "render", function( assert ) {
	assert.ok( true, "Not Done" );
});

//done, maybe better way to test
QUnit.test( "getTodaysDate", function( assert ) {
	assert.equal( getTodaysDate(), "04/29/2016", "Passed" );
});

//not done, objects
QUnit.test( "updateLabels", function( assert ) {
	assert.ok( true, "Not Done" );
});

//mostly done, need to test loop
QUnit.test( "createStimBoard", function( assert ) {
	stim_board = new Object;
	stim_board.position = new Object;
	stim_board.position.y = null;
	stim_board.position.x = null;
	stim_board.position.z = null;
	stim_board.rotation = new Object;
	stim_board.rotation.x = null;
	stim_board.visable = null;
	board.position.x = null;
	board.position.y = null;

	createStimBoard();

	assert.deepEqual( stim_board.position.y, 0, "Create stim board with default settings" );
	assert.deepEqual( stim_board.position.x, -860, "Create stim board with default settings" );
	assert.deepEqual( stim_board.position.z, -100, "Create stim board with default settings" );
	assert.deepEqual( stim_board.rotation.x, 1, "Create stim board with default settings" );
	assert.deepEqual( board.position.x, 200, "Create stim board with default settings" );
	assert.deepEqual( board.position.y, -100, "Create stim board with default settings" );
});

//not done
QUnit.test( "createViewStimuli", function( assert ) {
	assert.ok( true, "Not Done" );
});

//done, maybe
QUnit.test( "viewStimuli", function( assert ) {
	document.getElementsByClassName('view_stims')[0] = new Object;
	document.getElementsByClassName('view_stims')[0].style = new Object;
	document.getElementsByClassName('view_stims')[0].style.display = null;
	document.getElementsByClassName('draggable')[0] = new Object;
	document.getElementsByClassName('draggable')[0].style = new Object;
	document.getElementsByClassName('draggable')[0].style.display = null;

	viewStimuli();

	assert.deepEqual( document.getElementsByClassName('view_stims')[0].style.display, 'none', "Make sure the display is set to none" );
	assert.deepEqual( document.getElementsByClassName('draggable')[0].style.display, 'initial', "Make sure the display is set to initial" );
});

//not done, gui
QUnit.test( "createBeginExperiment", function( assert ) {
	assert.ok( true, "Not Done" );
});

//not done, objects
QUnit.test( "centerStimsOnBoard", function( assert ) {
	assert.ok( true, "Not Done" );
});

//almost done, need to test gui
QUnit.test( "createFinishExperiment", function( assert ) {
	document.getElementsByClassName('begin_gui')[0] = new Object;
	document.getElementsByClassName('begin_gui')[0].style = new Object;
	document.getElementsByClassName('begin_gui')[0].style.display = null;

	createFinishExperiment();

	var divThing = '<p>SOSA Modeling Experiment</p>'

	assert.deepEqual( document.getElementsByClassName('begin_gui')[0].style.display, 'none', "Make sure the style is set to none" );
	assert.deepEqual( info.innerHTML, divThing, "Make sure the right HTML was written" );
	assert.deepEqual( camera.position.z, 1000, "Make sure the camera is set" );
	assert.deepEqual( camera.position.y, 615, "Make sure the camera is set" );
});

//not done, objects
QUnit.test( "finishExperiment", function( assert ) {
	assert.ok( true, "Not Done" );
});

//not done, not sure how to test
QUnit.test( "goHome", function( assert ) {
	assert.ok( true, "Not Done" );
});

//mostly done, need to test for gui
QUnit.test( "createThanks", function( assert ) {
	document.getElementsByClassName('finish_gui')[0] = new Object;
	document.getElementsByClassName('finish_gui')[0].style = new Object;
	document.getElementsByClassName('finish_gui')[0].style.display = null;

	createThanks();

	var divThing = '<p>Thanks for using SOSA!</p>'

	assert.deepEqual( document.getElementsByClassName('finish_gui')[0].style.display, 'none', "Make sure the style is set to none" );
	assert.deepEqual( info.innerHTML, divThing, "Make sure the right HTML was written" );
});

//working on it
QUnit.test( "createGUI", function( assert ) {
	//gui controls test

	//set default test
	var boardTest = new Object;
	boardTest.boardR = null;
	boardTest.boardG = null;
	boardTest.boardB = null;
	//set rgb



	createGUI();


	assert.deepEqual( boardTest.boardR, "same", "Not Done" );
});

//done
QUnit.test( "readExperimentFromFile", function( assert ) {
	var testStim = '{orders:{order1:["stimName", "same"]}, stimuli:{stimName:{Name:"stimName", stimName:"stimName", stimR:255, stimG:255, stimB:255, sizeX:1, sizeY:1, sizeZ:1, bgR:0, bgG:0, bgB:0}, same:{Name:"same", stimName:"same", stimR:255, stimG:255, stimB:255, sizeX:1, sizeY:1, sizeZ:1, bgR:0, bgG:0, bgB:0}}}';

	assert.deepEqual( readExperimentFromFile(testStim), testStim, "Not Done" );
});

//not done
QUnit.test( "convertExperimentToThing", function( assert ) {
	//var order = [];
	//order[0] = new Object;
	//assert.deepEqual( convertExperimentToThing(testStim), "same", "Not Done" );
});

//not done, stimuli
QUnit.test( "makeStims", function( assert ) {
	assert.ok( true, "Not Done" );
});

//not done, wrapText
QUnit.test( "makeLabel", function( assert ) {
	assert.ok( true, "Not Done" );
});

//not done, wrapText
QUnit.test( "overwriteLabel", function( assert ) {
	assert.ok( true, "Not Done" );
});

//mostly done, objects
QUnit.test( "updateBoard", function( assert ) {
	boardColor = null;
	var boardDef = new Object;
	var boardDef2 = new Object;
	boardDef.bgB = null; boardDef2.bgB = 100;
	boardDef.bgG = null; boardDef2.bgG = 100;
	boardDef.bgR = null; boardDef2.bgR = 100;
	boardDef.boardB = null; boardDef2.boardB = 255;
	boardDef.boardG = null; boardDef2.boardG = 0;
	boardDef.boardR = null; boardDef2.boardR = 0;
	boardDef.hasBG = null; boardDef2.hasBG = 1;
	boardDef.labelB = null; boardDef2.labelB = 150;
	boardDef.labelG = null; boardDef2.labelG = 50;
	boardDef.labelR = null; boardDef2.labelR = 100;
	boardDef.labelShade = null; boardDef2.labelShade = 1;
	boardDef.labelSize = null; boardDef2.labelSize = 25;
	boardDef.labelsShowing = null; boardDef2.labelsShowing = true;
	boardDef.rotationX = null; boardDef2.rotationX = 0;
	updateBoard(boardDef, boardDef2);

	assert.deepEqual( boardDef.bgB, 100, "Background Blue Value set to blue value of background of GUI, in this case, 100" );
	assert.deepEqual( boardDef.bgG, 100, "Background Green Value set to green value of background of GUI, in this case, 100" );
	assert.deepEqual( boardDef.bgR, 100, "Background Red Value set to red value of background of GUI, in this case, 100" );
	assert.deepEqual( boardDef.boardB, 255, "Board Blue Value set to blue value of board of GUI, in this case, 255");
	assert.deepEqual( boardDef.boardG, 0, "Board Green Value set to green value of board of GUI, in this case, 0" );
	assert.deepEqual( boardDef.boardR, 0, "Board Red Value set to red value of board of GUI, in this case, 0" );
	assert.deepEqual( boardDef.hasBG, 1, "not sure");
	assert.deepEqual( boardDef.labelB, 150, "Label Blue Value set to blue value of board of GUI, in this case, 150" );
	assert.deepEqual( boardDef.labelG, 50, "Label Green Value set to green value of board of GUI, in this case, 50" );
	assert.deepEqual( boardDef.labelR, 100, "Label Red Value set to red value of board of GUI, in this case, 100" );
	assert.deepEqual( boardDef.labelShade, 1, "Label Shade Value set to shade value in GUI, in this case, 1" );
	assert.deepEqual( boardDef.labelSize, 25, "Label Size Value set to size value in GUI, in this case, true" );
	assert.deepEqual( boardDef.labelsShowing, true, "Label Showing Value set to value in GUI, in this case, true" );
	assert.deepEqual( boardDef.rotationX, 0, "Board Rotation Value set to rotation value in GUI, in this case, 0" );
	assert.deepEqual( board.rotation.x, 0, "Board Rotation Value set to rotation value in GUI, in this case, 0" );
	assert.deepEqual( dummy.rotation.x, -1.2, "Dummy Rotation Value set to rotation value in GUI, in this case, -1.2" );
	//forloop
	//assert.deepEqual( board.rotation.x, 0, "Board Rotation Value set to rotation value in GUI, in this case, 0" );
});


//not done, wrapText
QUnit.test( "wrapText", function( assert ) {
	assert.ok( true, "Not Done" );
});

//mostly done, board
QUnit.test( "setBoardColor", function( assert ) {
	boardColor = null;
	var boardDef = new Object;
	boardDef.boardR = 200;
	boardDef.boardG = 200;
	boardDef.boardB = 200;
	setBoardColor(boardDef);

	assert.deepEqual( boardColor, "rgb(200, 200, 200)", "Board Color set to color of board in GUI, in this case, Red 200, Blue 200, Green 200" );
});

//mostly done, renderer
QUnit.test( "setBackgroundColor", function( assert ) {
	bgColor = null;
	var boardDef = new Object;
	boardDef.bgR = 200;
	boardDef.bgG = 200;
	boardDef.bgB = 200;
	setBackgroundColor(boardDef);

	assert.deepEqual( bgColor, "rgb(200, 200, 200)", "Background Color set to color of background in GUI, in this case, Red 200, Blue 200, Green 200" );
});

//mostly done, objects
QUnit.test( "setLabelColor", function( assert ) {
	labelSize = null;
	labelColor = null;
	labelShowing = true;
	var boardDef = new Object;
	boardDef.labelsShowing = true;
	boardDef.labelSize = 50;
	boardDef.labelR = 200;
	boardDef.labelG = 200;
	boardDef.labelB = 200;
	boardDef.labelShade = 0;

	setLabelColor(boardDef);

	assert.deepEqual( labelSize, "50px", "Label Size set to value of labels in GUI, in this case, 50" );
	assert.deepEqual( labelColor, "rgba(200, 200, 200, 0)", "Label Color set to color of labels in GUI, in this case, Red 200, Blue 200, Green 200, Shade 0" );
});

//mostly done, objects
QUnit.test( "setLabelSize", function( assert ) {
	labelSize = null;
	labelColor = null;
	var boardDef = new Object;
	boardDef.labelSize = 50;
	boardDef.labelR = 200;
	boardDef.labelG = 200;
	boardDef.labelB = 200;
	boardDef.labelShade = 0;
	labelsShowing = false;

	setLabelSize(boardDef);

	assert.deepEqual( labelSize, null, "Label Size not set when labelsShowing is false" );
	assert.deepEqual( labelColor, null, "Label Color not set when labelsShowing is false" );

	labelsShowing = true;
	setLabelSize(boardDef);

	assert.deepEqual( labelSize, "50px", "Label Size set to value of labels in GUI, in this case, 50" );
	assert.deepEqual( labelColor, "rgba(200, 200, 200, 0)", "Label Color set to color of labels in GUI, in this case, Red 200, Blue 200, Green 200, Shade 0" );
});

//mostly done, objects
QUnit.test( "setLabelDefaults", function( assert ) {
	labelSize = null;
	labelColor = null;
	var boardDef = new Object;
	boardDef.labelR = null;
	boardDef.labelG = null;
	boardDef.labelB = null;
	boardDef.labelShade = null;
	boardDef.labelSize = null;

	setLabelDefaults(boardDef);

	assert.deepEqual( labelSize, "20px", "Label Size set to default size of 20" );
	assert.deepEqual( labelColor, "rgba(255, 0, 0, 1)", "Label Color set to default color of red" );
	assert.deepEqual( boardDef.labelR, 255, "Label Red value set to default value of 255" );
	assert.deepEqual( boardDef.labelG, 0, "Label Green value set to default value of 0" );
	assert.deepEqual( boardDef.labelB, 0, "Label Blue value set to default value of 0" );
	assert.deepEqual( boardDef.labelShade, 1, "Label Shade value set to default value of 1" );
	assert.deepEqual( boardDef.labelSize, 20, "Label Size value set to default value of 20" );
});

//not done, objects
QUnit.test( "toggleLabels", function( assert ) {
	assert.ok( true, "Not Done" );
});

//done
QUnit.test( "calculateDistance", function( assert ) {

	var first = new Object;
	first.position = new Object;
	var second = new Object;
	second.position = new Object;

	first.position.x = 100;
	first.position.y = 100;
	second.position.x = 100;
	second.position.y = 100;
	assert.deepEqual( calculateDistance(first,second), 0, "Absolute Value of Square Root of (0 Squared + 0 Squared) = 0" );

	first.position.x = 500;
	first.position.y = -200;
	second.position.x = -600;
	second.position.y = 100;
	assert.deepEqual( calculateDistance(first,second), 1140, "Absolute Value of Square Root of (-1100 Squared + 300 Squared) = 1140" );

	first.position.x = 10;
	first.position.y = 9;
	second.position.x = 8;
	second.position.y = 7;
	assert.deepEqual( calculateDistance(first,second), 3, "Absolute Value of Square Root of (-2 Squared + -2 Squared) = 3" );

	first.position.x = 22;
	first.position.y = -44;
	second.position.x = 66;
	second.position.y = -88;
	assert.deepEqual( calculateDistance(first,second), 62, "Absolute Value of Square Root of (44 Squared + -44 Squared) = 62" );

	first.position.x = 300;
	first.position.y = -800;
	second.position.x = 200;
	second.position.y = -400;
	assert.deepEqual( calculateDistance(first,second), 412, "Absolute Value of Square Root of (-100 Squared + 400 Squared) = 412" );
});

//done
QUnit.test("getTimeStamp", function( assert ) {
	var date = new Date();
	var result = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	assert.deepEqual(getTimeStamp(),result,"Should show current time")
});