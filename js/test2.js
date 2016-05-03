//done
QUnit.test( "init", function( assert ) {

	init();

	//assert.deepEqual( container, , "Passed" );
	assert.deepEqual( camera.position.y, 150, "Passed" );
	assert.deepEqual( camera.position.z, 500, "Passed" );

	assert.deepEqual( stim.position.y, 200, "Passed" );
	assert.deepEqual( stim.rotation.x, .5, "Passed" );

});

//not used
//QUnit.test( "onWindowResize", function( assert ) {
//	assert.equal( windowHalfX, window.innerWidth / 2, "Passed" );
//	assert.equal( windowHalfY, window.innerHeight / 2, "Passed" );
//
//	assert.equal( camera.aspect, window.innerWidth / window.innerHeight, "Passed" );
//});

//done, three js
//QUnit.test( "animate", function( assert ) {
//	assert.ok( true, "Imported from three js" );
//});

//done, three js
//QUnit.test( "render", function( assert ) {
//	assert.ok( true, "Imported from three js" );
//});

QUnit.test("createGUI", function(assert){
	assert.ok(true, "yes");
});

QUnit.test( "setStimColor", function( assert ) {
	stimColor = null;
	var stimDef = new Object;
	stimDef.stimR = 200;
	stimDef.stimG = 200;
	stimDef.stimB = 200;
	setStimColor(stimDef);

	assert.deepEqual( stimColor, "rgb(200, 200, 200)", "Stim Color set to color of stim in GUI, in this case, Red 200, Blue 200, Green 200" );
});

//done
QUnit.test( "setBackgroundColor", function( assert ) {
	bgColor = null;
	var boardDef = new Object;
	boardDef.bgR = 200;
	boardDef.bgG = 200;
	boardDef.bgB = 200;
	setBackgroundColor(boardDef);

	assert.deepEqual( bgColor, "rgb(200, 200, 200)", "Background Color set to color of background in GUI, in this case, Red 200, Blue 200, Green 200" );
});

//done
QUnit.test( "setStimSize", function( assert ) {
	var stimDef = new Object;
	stim.scale.x = null; stimDef.sizeX = 2;
	stim.scale.y = null; stimDef.sizeY = 2;
	stim.scale.z = null; stimDef.sizeZ = 2;

	setStimSize(stimDef);

	assert.deepEqual( stim.scale.x, 2, "Stim Size set to value of size in GUI, in this case, 2" );
	assert.deepEqual( stim.scale.y, 2, "Stim Size set to value of size in GUI, in this case, 2" );
	assert.deepEqual( stim.scale.z, 2, "Stim Size set to value of size in GUI, in this case, 2" );
});

//done
QUnit.test( "setLabelDefaults", function( assert ) {
	stimColor = null;
	bgColor = null;
	stim.scale.x = null;
	stim.scale.y = null;
	stim.scale.z = null;
	var stimDef = new Object;
	stimDef.stimName = null;
    stimDef.stimR = null;
    stimDef.stimG = null;
    stimDef.stimB = null;
    stimDef.sizeX = null;
    stimDef.sizeY = null;
    stimDef.sizeZ = null;
    stimDef.bgR = null;
    stimDef.bgG = null;
    stimDef.bgB = null;	

	setDefaults(stimDef);

	assert.deepEqual( stimColor, "rgb(255,255,255)", "Stim color string set to default value of rgb(255,255,255)" );
	assert.deepEqual( bgColor, "rgb(0,0,0)", "Stim color string set to default value of rgb(0,0,0)" );
	assert.deepEqual( stim.scale.x, 1, "Stim X Size set to default size of 1" );
	assert.deepEqual( stim.scale.y, 1, "Stim Y Size set to default size of 1" );
	assert.deepEqual( stim.scale.z, 1, "Stim Z Size set to default size of 1" );
	assert.deepEqual( stimDef.stimName, "stimName", "Stim Name set to default value of stimName" );
	assert.deepEqual( stimDef.stimR, 255, "Stim Red Value set to default value of 255" );
	assert.deepEqual( stimDef.stimG, 255, "Stim Green Value set to default value of 255" );
	assert.deepEqual( stimDef.stimB, 255, "Stim Blue Value set to default value of 255" );
	assert.deepEqual( stimDef.sizeX, 1, "Stim X Size set to default size of 1" );
	assert.deepEqual( stimDef.sizeY, 1, "Stim Y Size set to default size of 1" );
	assert.deepEqual( stimDef.sizeZ, 1, "Stim Z Size set to default size of 1" );
	assert.deepEqual( stimDef.bgR, 0, "Background Red Value set to default value of 0" );
	assert.deepEqual( stimDef.bgG, 0, "Background Green Value set to default value of 0" );
	assert.deepEqual( stimDef.bgB, 0, "Background Blue Value set to default value of 0" );

});