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

//---DAT.GUI FUNCTIONS---
QUnit.test( "animate", function( assert ) {
	assert.ok( true, "THIS IS A DAT.GUI FUNCTION" );
});
QUnit.test( "render", function( assert ) {
	assert.ok( true, "THIS IS A DAT.GUI FUNCTION" );
});

//---COMPLETED---
QUnit.test( "getTodaysDate", function( assert ) {
	assert.deepEqual( getTodaysDate(), "04/23/2016", "Passed" );
});

//---INCOMPLETE---
QUnit.test( "updateLabels", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "createStimBoard", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "createViewStimuli", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "viewStimuli", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "createBeginExperiment", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "centerStimsOnBoard", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "createFinishExperiment", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "finishExperiment", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "createGUI", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "readExperimentFromFile", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "convertExperimentToThing", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "makeStims", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "makeLabel", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "overwriteLabel", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "updateBoard", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "wrapText", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "setBoardColor", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "setBackgroundColor", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "setLabelColor", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "setLabelSize", function( assert ) {
	assert.ok( true, "Not Done" );
});
QUnit.test( "toggleLabels", function( assert ) {
	assert.ok( true, "Not Done" );
});

//---COMPLETED---
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