import * as Planet from './src/constants/planets.js';
import * as Index from './src/constants/index.js';
import * as CalculateOrbit from './cal_orbit.js';

//import * as OrbitController from './calculation_orbit.js'; 
//<- 이 부분에서 오류 나는 듯
const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  scaleToView: true
};

var plants_Mesh = [];


//compute angle
function angleToRad (angle) {
  return Math.PI / 180 * angle
}

//rotate XZ coordinate
function rotateXZ (x, z, rotate) {
  var xx = x * Math.cos(angleToRad(rotate)) - z * Math.sin(angleToRad(rotate))
  var zz = x * Math.sin(angleToRad(rotate)) + z * Math.cos(angleToRad(rotate))
  return [xx, zz]
}

function makeCircle (radius = 30, rotate = 50, minAngle = 5) {

  var vertices = []

  for(var i = 0; i < 360; i += minAngle){
      // vertices.push(new THREE.Vector3(0, 0, 0))

      var x = Math.cos(angleToRad(i)) * radius
      var z = Math.sin(angleToRad(i)) * radius
      var xn = Math.cos(angleToRad(i + minAngle)) * radius
      var zn = Math.sin(angleToRad(i + minAngle)) * radius
      

      vertices.push(new THREE.Vector3(rotateXZ(x, z, rotate)[0], 0,rotateXZ(x, z, rotate)[1] ))
      vertices.push(new THREE.Vector3(rotateXZ(xn, zn, rotate)[0], 0,rotateXZ(xn, zn, rotate)[1]))

  }   
  return vertices
}

//camera[0] option(global object)
var camera = [];
var projector, mouse = { x: 0, y: 0 };
var renderer;
var scene;
var controls,controls2;
//value is object distance z(정면에서 보기위해서)
var value_z = 0;
//move flag(버튼을 연속으로 못누르게 lock)
var flag = 0;
//rendering ID
var moveID;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const tempV= new THREE.Vector3();
//button spotlight
var spotlight2

//space_ship button
var s_flag = true;
var shipRenderID;

window.onload = function init() 
{ 
  //const p = SUN.radius;
  
	var canvas = document.getElementById( "gl-canvas" );
  // RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha : true,
  });

  renderer.setClearColor("#121212", 1);

  // camera[0]
  camera[0] = new THREE.PerspectiveCamera(100, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
  camera[0].position.set(30, 5, 35);
  camera[1] = new THREE.PerspectiveCamera(100, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
  
  // ORBIT CONTROLS
  controls = new THREE.OrbitControls(camera[0], renderer.domElement);
  controls.target.set(30, 0, 0);
  controls2 = new THREE.OrbitControls(camera[1], renderer.domElement);
  controls2.maxDistance = 10;
  controls2.minDistance = 10;
  /*
   * TEXTURES
   */
  const loader = new THREE.TextureLoader();
  
  const sunTexture = loader.load("assets/sun.jpg");
  const mercuryTexture = loader.load("assets/mercury.jpg");
  const venusTexture = loader.load("assets/venus.jpg");
  const earthTexture = loader.load("assets/earth.jpg");
  const marsTexture = loader.load("assets/mars.jpg");
  const jupiterTexture = loader.load("assets/jupiter.jpg");
  const saturnTexture = loader.load("assets/saturn.jpg");
  const uranusTexture = loader.load("assets/uranus.jpg");
  const neptuneTexture = loader.load("assets/neptune.jpg");
  const plutoTexture = loader.load("assets/pluto.jpeg");

  /*
   * MATERIALS
   */
  const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
  const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
  const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture});
  const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
  const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
  const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
  const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
  const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
  const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });

  const labelContainerElem = document.querySelector('#labels');//-DongMin
  const labelContainerElem2 = document.querySelector('#container2');//-DongMin

  //scene
  scene = new THREE.Scene();
  /*
    * background
    */
  const loader2 = new THREE.CubeTextureLoader();//큐브형식으로 배경 
  const texture = loader2.load([
      './space_ship/ress/space2-1.jpg',
      './space_ship/ress/space2-2.jpg',
      './space_ship/ress/space2-3.jpg',
      './space_ship/ress/space2-4.jpg',
      './space_ship/ress/space2-5.jpg',
      './space_ship/ress/space2-6.jpg',
  ]);
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;

  const lineMaterial = new THREE.LineBasicMaterial ({
    linewidth: 100
  });


  /*
   * MESH
   */
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  //plants number
  var plants_number = 10;//-DongMin
  //-DongMin

  const sunMesh = new THREE.Mesh(geometry, sunMaterial);
  sunMesh.position.set(0, 0, 0);
  sunMesh.scale.setScalar(10);
  scene.add(sunMesh);
  const elem = document.createElement('button');//-DongMin
  elem.textContent = "SUN";//-DongMin
  elem.name = "SUN";
  labelContainerElem.appendChild(elem);//-DongMin
  sunMesh.userData = 20;
  plants_Mesh = plants_Mesh.concat(sunMesh);//-DongMin

  const mercuryGroup = new THREE.Group();
  const mercuryMesh = new THREE.Mesh(geometry, mercuryMaterial);
  createPlanet(scene, mercuryMesh, mercuryGroup, 25, 0.8,"MERCURY");//-DongMin
  plants_Mesh = plants_Mesh.concat(mercuryMesh);//-DongMin

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(makeCircle(25));
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  const venusGroup = new THREE.Group();
  const venusMesh = new THREE.Mesh(geometry, venusMaterial);
  createPlanet(scene, venusMesh, venusGroup, 28, 0.9,"VENUS");//-DongMin
  plants_Mesh = plants_Mesh.concat(venusMesh);//-DongMin

  const earthGroup = new THREE.Group();
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  createPlanet(scene, earthMesh, earthGroup, 31, 1,"EARTH");//-DongMin
  plants_Mesh = plants_Mesh.concat(earthMesh);//-DongMin

  const marsGroup = new THREE.Group();
  const marsMesh = new THREE.Mesh(geometry, marsMaterial);
  createPlanet(scene, marsMesh, marsGroup, 34, 0.8,"MARS");//-DongMin
  plants_Mesh = plants_Mesh.concat(marsMesh);//-DongMin

  const jupiterGroup = new THREE.Group();
  const jupiterMesh = new THREE.Mesh(geometry, jupiterMaterial);
  createPlanet(scene, jupiterMesh, jupiterGroup, 42, 3.5,"JUPITER");//-DongMin
  plants_Mesh = plants_Mesh.concat(jupiterMesh);//-DongMin

  const saturnGroup = new THREE.Group();
  const saturnMesh = new THREE.Mesh(geometry, saturnMaterial);
  createPlanet(scene, saturnMesh, saturnGroup, 50, 2.9,"SATURN");//-DongMin
  plants_Mesh = plants_Mesh.concat(saturnMesh);//-DongMin

  const uranusGroup = new THREE.Group();
  const uranusMesh = new THREE.Mesh(geometry, uranusMaterial);
  createPlanet(scene, uranusMesh, uranusGroup, 56, 1.7, "URANUS");//-DongMin
  plants_Mesh = plants_Mesh.concat(uranusMesh);//-DongMin

  const neptuneGroup = new THREE.Group();
  const neptuneMesh = new THREE.Mesh(geometry, neptuneMaterial);
  createPlanet(scene, neptuneMesh, neptuneGroup, 60, 1.65, "NEPTUNE");//-DongMin
  plants_Mesh = plants_Mesh.concat(neptuneMesh);//-DongMin

  const plutoGroup = new THREE.Group();
  const plutoMesh = new THREE.Mesh(geometry, plutoMaterial);
  createPlanet(scene, plutoMesh, plutoGroup, 64, 0.5,"PLUTO");//-DongMin
  plants_Mesh = plants_Mesh.concat(plutoMesh);//-DongMin


  /*
   * LIGHTING
   */

  const light = new THREE.PointLight("white", 1.25);
  light.position.set(0, 0, 0);
  scene.add(light);

  // illuminate the sun
  createSpotlights(scene);

  /*
   * HELPERS
   */
  scene.add(new THREE.PointLightHelper(light, 0.2));
  //scene.add( new THREE.SpotLightHelper( spotLightLeft ));
  scene.add(new THREE.GridHelper(75, 50));


  var clock = new THREE.Clock();
  var speed = 1;
  var delta = 0;
  var movement = 1;


  // draw each frame
  render();
var computed;
  function render(){
    
    // var time = clock.getElapsedTime(); 
    // console.log(time);
    controls.update();
    movement +=0.1;

    sunMesh.rotation.y = movement * 0.05

    //mercuryGroup.rotation.y = movement * 0.5;
    computed = CalculateOrbit.cal_orbit('MERCURY');
    mercuryGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    mercuryMesh.rotation.y = movement * 0.20;

    //console.log(computed.pos.x/Index.AU,computed.pos.y/Index.AU)
    computed = CalculateOrbit.cal_orbit('VENUS');
    venusGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //venusGroup.rotation.y = movement * 0.35;
    venusMesh.rotation.y = movement * 0.18;
    
    computed = CalculateOrbit.cal_orbit('EARTH');
    earthGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //earthGroup.rotation.y = movement * 0.3;
    earthMesh.rotation.y = movement * 0.15;

    computed = CalculateOrbit.cal_orbit('MARS');
    marsGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //marsGroup.rotation.y = movement * 0.2;
    marsMesh.rotation.y = movement * 0.2;

    computed = CalculateOrbit.cal_orbit('JUPITER');
    jupiterGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //jupiterGroup.rotation.y = movement * 0.05;
    jupiterMesh.rotation.y = movement * 0.05;
    
    computed = CalculateOrbit.cal_orbit('SATURN');
    saturnGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //saturnGroup.rotation.y = movement * 0.03;
    saturnMesh.rotation.y = movement * 0.25;
    
    computed = CalculateOrbit.cal_orbit('URANUS');
    uranusGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //uranusGroup.rotation.y = movement * 0.02;
    uranusMesh.rotation.y = movement * 0.25;

    computed = CalculateOrbit.cal_orbit('NEPTUNE');
    neptuneGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //neptuneGroup.rotation.y = movement * 0.015;
    neptuneMesh.rotation.y = movement * 0.25;

    computed = CalculateOrbit.cal_orbit('PLUTO');
    plutoGroup.position.set(computed.pos.x/Index.AU,0,computed.pos.y/Index.AU);
    //plutoGroup.rotation.y = movement * 0.005;
    plutoMesh.rotation.y = movement * 0.2;

    for(var i = 0; i<10; i++){
      plants_Mesh[i].updateWorldMatrix(true,false);
      plants_Mesh[i].getWorldPosition(tempV);

      tempV.project(camera[0]);
      const x = (tempV.x * .5+ .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
      labelContainerElem.childNodes[i].style.transform = `translate(-50%, -50%) translate(${ x }px,${ y }px)`;
    }
    
    requestAnimationFrame(render);
    renderer.render(scene, camera[0]);
  }

      //controls.dispose();
      //renderer.dispose();
  function createPlanet(scene, mesh, group, x, scale, name) {//-DongMin
    const elem = document.createElement('button');//-DongMin
    elem.textContent = name;//-DongMin
    elem.name = name;
    labelContainerElem.appendChild(elem);//-DongMin
    mesh.position.set(x, 0, 0);
    mesh.scale.setScalar(scale);
    mesh.userData = scale * 2;
    group.add(mesh);
    scene.add(group);
  }

  function createSpotlights(scene) {
    var color = 0xFFFFFF;
    var intensity = 5;
    var distance = 25;
    var angle = Math.PI/7;

    new Array(6).fill('').forEach((item, i) => {
      var spotlight = new THREE.SpotLight(color, intensity, distance, angle);
      var value = i % 2 === 0 ? 25 : -25;

      spotlight.position.set(
        i < 2 ? value : 0,
        i >= 2 && i < 4 ? value : 0,
        i >= 4 ? value : 0
      );
    scene.add( spotlight );
  });
}
  //button spotlight
  spotlight2 = new THREE.PointLight( 0xFFFFFF,0.2);
  spotlight2.position.set(0,0,0);
  scene.add(spotlight2);

  //camera[0] button
  var button_list = [];
  var object_num =0;
  for(var i=0; i < plants_number; i++){
    button_list = button_list.concat("Button"+i);
  }

  //sun
  document.getElementById(button_list[0]).onclick = function (event){
    value_z = 15;//value_Z는 정면에서 보기 위한 z축의 값
    object_num = 0;
    sunMesh.updateWorldMatrix(true,false);
    plants_Mesh[0].getWorldPosition(tempV);

    moveCam(tempV.x,tempV.y,tempV.z,tempV.x,tempV.y,tempV.z,plants_Mesh[0]);
    //moveCam(scene.children[object_num].position.x,scene.children[object_num].position.y,scene.children[object_num].position.z,scene.children[object_num].position.x,scene.children[object_num].position.y,scene.children[object_num].position.z);
  };
  labelContainerElem.childNodes[0].onclick = function (event){
    value_z = 15;
    sunMesh.updateWorldMatrix(true,false);
    plants_Mesh[0].getWorldPosition(tempV);
    moveCam(tempV.x,tempV.y,tempV.z,tempV.x,tempV.y,tempV.z,plants_Mesh[0]);
    };

  //plant
  for(i=1;i<plants_number;i++){  
    var temp_button = document.getElementById(button_list[i])
    temp_button.button = i;
    temp_button.onclick = function(event){
      //scene.children[5].children[0].position.x
      value_z = 5;//value_Z는 정면에서 보기 위한 z축의 값
      object_num = event.path[0].button;//plant order
      // moveCam(scene.children[object_num].children[0].position.x,scene.children[object_num].children[0].position.y,scene.children[object_num].children[0].position.z,scene.children[object_num].children[0].position.x,scene.children[object_num].children[0].position.y,scene.children[object_num].children[0].position.z);

      plants_Mesh[object_num].getWorldPosition(tempV);

      moveCam(tempV.x,tempV.y,tempV.z,tempV.x,tempV.y,tempV.z,plants_Mesh[object_num]);

    };
    labelContainerElem.childNodes[i].id = i;
    labelContainerElem.childNodes[i].onclick = function (event){
      value_z = 5;//value_Z는 정면에서 보기 위한 z축의 값
      object_num = event.path[0].id;
      plants_Mesh[object_num].getWorldPosition(tempV);
      moveCam(tempV.x,tempV.y,tempV.z,tempV.x,tempV.y,tempV.z,plants_Mesh[object_num]);
    }
  }

  document.getElementById("Button_Init").onclick = function(){
    value_z = 0;
    controls.maxDistance = 1000;
    controls.minDistance = 5;
    moveCam(0, 30, 0,0,0,0,0);
  };

  /*
  * Space Ship
  */
  document.getElementById("Button_Space_ship").onclick = function(){
    if(s_flag){
      labelContainerElem.style.display='none';
      labelContainerElem2.style.display='none';
      space_ship_render();
      s_flag = false;
    }
    else{
      labelContainerElem.style.display='';
      labelContainerElem2.style.display='';
      scene.remove( mesh_ship );
      value_z = 0;
      moveCam(0, 30, 0,0,0,0,0);
      s_flag = true;
    }

  };


};


//camera[0] moving -DongMin
function moveCam(eye_x, eye_y, eye_z, target_x, target_y, target_z, Mesh)
{   
  window.cancelAnimationFrame(moveID);
  window.cancelAnimationFrame(shipRenderID);
  spotlight2.position.set(0,0,0);
  if(flag == 1){
    return;
  }

  //button lock
  flag = 1;

  var loading_num = 20;

  //move eye changeed value(변화량)
  var m_e_x = (eye_x - camera[0].position.x)/loading_num;
  var m_e_y = (eye_y - camera[0].position.y)/loading_num;
  var m_e_z = (eye_z - camera[0].position.z + value_z)/loading_num;
  //move target changeed value(변화량)
  var m_t_x = (target_x - controls.target.x)/loading_num;
  var m_t_y = (target_y - controls.target.y)/loading_num;
  var m_t_z = (target_z - controls.target.z)/loading_num;

  // console.log(m_e_x,m_e_y,m_e_z);
  // console.log(m_t_x,m_t_y,m_t_z);

  //camera[0] position
  var c_x = camera[0].position.x;
  var c_y = camera[0].position.y;
  var c_z = camera[0].position.z;

  //target position
  var t_x = controls.target.x;
  var t_y = controls.target.y;
  var t_z = controls.target.z;
  var i = 0;

  function move_view(){
    i++;
    camera[0].position.set ( c_x + i*m_e_x, c_y + i*m_e_y, c_z + i*m_e_z  );
    controls.target.set( t_x + i*m_t_x, t_y + i*m_t_y, t_z + i*m_t_z);
    renderer.render(scene,camera[0]);
    controls.update();
    if(i != loading_num)
      moveID=window.requestAnimationFrame(move_view);
    else{
      window.cancelAnimationFrame(moveID);
    function move_object(){
      Mesh.getWorldPosition(tempV);
      controls.maxDistance = Mesh.userData;
      controls.minDistance = Mesh.userData;
      controls.target.set(tempV.x,tempV.y,tempV.z);
      //클릭시 빛....애매함.
      spotlight2.position.set(camera[0].position.x,camera[0].position.y,camera[0].position.z);
      renderer.render(scene,camera[0]);
      controls.update();
      moveID=window.requestAnimationFrame(move_object);
    }
    if(Mesh != 0){
      move_object();
    }
      //button unlock
      flag = 0;
    }
  }
  move_view();
}
/*
* Spcae ship
*/
var mesh_ship;
var speed = 0.0;
var spaceship = new THREE.Object3D();
var spaceshipScene

function space_ship_render(){
  window.cancelAnimationFrame(moveID);
  window.cancelAnimationFrame(shipRenderID);

  var follow,keys;
  var coronaSafetyDistance = 0.3;
  var velocity = 0.0;
  var temp = new THREE.Vector3;
  var dir = new THREE.Vector3;
  var temp = new THREE.Vector3;
  var dir = new THREE.Vector3;
  var a = new THREE.Vector3;
  var b = new THREE.Vector3;

  var gltfloader = new THREE.GLTFLoader();
  var material = new THREE.MeshNormalMaterial();

  var tempEarth = new THREE.Vector3();

  plants_Mesh[3].getWorldPosition(tempEarth);
  console.log(tempEarth.x,tempEarth.y + 2,tempEarth.z)

  gltfloader.load('assets/spaceship.gltf', function( gltf) {
      spaceship = gltf.scene;
      console.log(spaceship);
      
      
      console.log(spaceship.position.x, spaceship.position.y, spaceship.position.z)

      spaceship.scene.position.set(tempEarth.x,tempEarth.y + 2,tempEarth.z);
      spaceship.position.set(tempEarth.x,tempEarth.y + 2,tempEarth.z);

      // spaceship.scene.scale.set(0.01, 0.01, 0.01);
      // spaceship.scene = gltf.scene;
      scene.add(spaceship.scene)

      
  } );

  
  // console.log(spaceship)
  // mesh_ship = new THREE.Mesh( spaceship.geometry, material );
  
  // mesh_ship.position

  // spaceship
    
  //goal_ship = new THREE.Object3D;
  follow = new THREE.Object3D;
  follow.position.z = -coronaSafetyDistance;
  // mesh_ship.add( follow );

  spaceship.add(follow);
  // mesh_ship = spaceship


    keys = {//방향키 초기화
      a: false,
      s: false,
      d: false,
      w: false,
      j: false,
      k: false,
      h: false
    };
    
    document.body.addEventListener( 'keydown', function(e) {
      
      const key = e.code.replace('Key', '').toLowerCase();
      if ( keys[ key ] !== undefined )
        keys[ key ] = true;
      
    });
    document.body.addEventListener( 'keyup', function(e) {
      
      const key = e.code.replace('Key', '').toLowerCase();
      if ( keys[ key ] !== undefined )
        keys[ key ] = false;
      
    });
    value_z = 5;
    camera[1].position.set( spaceshipScene.position.x,spaceship.position.y + 3,spaceshipScene.position.z - 5 );
   animate_spaceship();
  

  function animate_spaceship() {

    // controls.update();

    shipRenderID = requestAnimationFrame( animate_spaceship );
      
    
    if ( keys.j )//w면 앞으로
      speed = speed+0.05;
    else if ( keys.k )//w면 앞으로
      speed = speed-0.05;
    else if ( keys.h )//w면 앞으로
      speed = 0;
    // else if ( keys.s )//s면 뒤로
    //   speed = -0.1;

    velocity += ( speed - velocity ) * .3;
    spaceshipScene.translateZ( velocity );

    if ( keys.a ){//a면 왼쪽 회전
      spaceshipScene.rotateY(0.02);
    }
    else if ( keys.d )//d면 오른쪽 회전
      spaceshipScene.rotateY(-0.02);
    else if ( keys.w )//d면 오른쪽 회전
      spaceshipScene.rotateX(0.02);
    else if ( keys.s )//d면 오른쪽 회전
      spaceshipScene.rotateX(-0.02);
      
    //////////////////////////////////////////
    //이부분에서 물체 회전 할 때 카메라 회전하는게 조금 부자연스러워서 로직 수정해야함
    a.lerp(spaceshipScene.position, 0.4);
    //b.copy(goal_ship.position);//goal == camera[0]
    
      dir.copy( a ).sub( b ).normalize();
      const dis = a.distanceTo( b ) - coronaSafetyDistance;
      // goal_ship.position.addScaledVector( dir, dis );
      // goal_ship.position.lerp(temp, 0.1);
      temp.setFromMatrixPosition(follow.matrixWorld);
      
      //camera[1].position.set( mesh_ship.position.x,mesh_ship.position.y,mesh_ship.position.z + value_z);
      
      camera[1].lookAt( spaceshipScene.position );
      controls2.target.set(spaceshipScene.position.x,spaceshipScene.position.y,spaceshipScene.position.z);
      renderer.render( scene, camera[1] );
      controls2.update();
      ///////////////////////

  }
}


