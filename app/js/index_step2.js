require("../css/style.css");

var THREE = require("three");

var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0
};

window.addEventListener("load", init, false);

function init(){
	createScene();

	createLights();

	createPlane();
	createSea();
	createSky();

	document.addEventListener("mousemove", handleMouseMove, false);

	loop();

}

var scene, camera, fieldOfView, aspectRatio, nearPlane, 
farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);

	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	renderer = new THREE.WebGLRenderer({
		alpha: true,

		antialias: true
	});

	renderer.setSize(WIDTH, HEIGHT);

	renderer.shadowMap.enabled = true;

	container = document.getElementById("world");
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights(){
	hemisphereLight = new THREE.HemisphereLight(0xaaaaa, 0x00000, .9);
	shadowLight = new THREE.DirectionalLight(0xffff, .9);

	shadowLight.position.set(150, 350, 350);

	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;


	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);

}

Sea = function() {

	var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: .6,
		shading: THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);

	this.mesh.receiveShadow = true;
}

var sea;
function createSea() {
	sea = new Sea();

	sea.mesh.position.y = -600;

	scene.add(sea.mesh);
}

Cloud = function(){
	this.mesh = new THREE.Object3D();

	var geom = new THREE.BoxGeometry(20, 20, 20);

	var mat = new THREE.MeshPhongMaterial({
		color: Colors.white
	});

	var nBlocs = 3+Math.floor(Math.random()*3);
	for(var i=0; i<nBlocs; i++){

		var m = new THREE.Mesh(geom, mat);

		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;

		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}
}

Sky = function(){
	this.mesh = new THREE.Object3D();

	this.nClouds = 20;

	var stepAngle = Math.PI*2 / this.nClouds;

	for(var i = 0; i < this.nClouds; i++){
		var c = new Cloud();

		var a = stepAngle*i;
		var h = 750 + Math.random()*200;

		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		c.mesh.rotation.z = a+Math.PI/2;

		c.mesh.position.z = -400-Math.random()*400;

		var s = 1+Math.random()*2;
		c.mesh.scale.set(s, s, s);

		this.mesh.add(c.mesh);
	}
}

var sky;
function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

var AirPlane = function(){
	this.mesh = new THREE.Object3D();

	var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	geomCockpit.vertices[4].y -= 10;
	geomCockpit.vertices[4].z += 20;
	geomCockpit.vertices[5].y -= 10;
	geomCockpit.vertices[5].z -= 20;
	geomCockpit.vertices[6].y += 30;
	geomCockpit.vertices[6].z += 20;
	geomCockpit.vertices[7].y += 30;
	geomCockpit.vertices[7].z -= 20;

	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);

	var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35, 25, 0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);


	var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

	var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;

	var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});


	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8, 0, 0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50, 0, 0);
	this.mesh.add(this.propeller);

};

var airplane;
function createPlane(){
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25, .25, .25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}


function loop(){
	// airplane.propeller.rotation.x += .3;
	sea.mesh.rotation.z += .005;
	sky.mesh.rotation.z += .01;

	updatePlane();

	renderer.render(scene, camera);

	requestAnimationFrame(loop);
}

var mousePos = {x:0, y:0};
function handleMouseMove(event){
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};
}

function updatePlane(){
	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(mousePos.y, -1, 1, 25, 175);

	airplane.mesh.position.y = targetY;
	airplane.mesh.position.x = targetX;
	airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax){
	var nv = Math.max(Math.min(v, vmax), vmin);
	var dv = vmax - vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

var Pilot = function(){
	this.mesh = new THREE.Object3D();
	this.mesh.name = "pilot";

	this.angleHairs = 0;

	var bodyGeom = new THREE.BoxGeometry(15,15,15);
	var bodyMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	var body = new THREE.Mesh(bodyGeom, bodyMat);
	body.position.set(2, -12, 0);
	this.mesh.add(body);

	var faceGeom = new THREE.BoxGeometry(10, 10, 10);
	var faceMat = new THREE.MeshLamberMaterial({color:Colors.pink});
	var face = new THREE.Mesh(faceGeom, faceMat);
	this.mesh.add(face);

	var hairGeom = new THREE.BoxGeometry(4,4,4);
	var hairMat = new THREE.MeshLamberMaterial({color:Colors.brown});
	var hair = new THREE.Mesh(hairGeom, hairMat);

	hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

	var hairs = new THREE.Object3D();

	this.hairsTop = new THREE.Object3D();

	for(var i=0; i<12; i++){
		var h = hair.clone();
		var col = i % 3;
		var row = Math.floor(i/3);
		var startPosZ = -4;
		var startPosX = -4;
		h.position.set(startPosX + row*4, 0, startPosZ + col*4);
		this.hairsTop.add(h);
	}
	hairs.add(this.hairsTop);

	var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
	var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
	var hairSideL = hairSideR.clone();
	hairSideR.position.set(8, -2, 6);
	hairSideL.position.set(8, -2, -6);
	hairs.add(hairSideR);
	hairs.add(hairSideL);

	var hairBackGeom = new THREE.BoxGeometry(2,8,10);
	var hairBack = new THREE.Mesh(hairBackGeom,hairMat);
	hairBack.position.set(-1, -4, 0);
	hairs.add(hairBack);
	hairs.position.set(-5, 5, 0);




























	}




























}








