var PLAY = 1;
var END = 0;
var gameState = PLAY;

var rabbit, rabbit_running, rabbit_collided
var ground, invisibleGround, groundImage;
var fox

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;



function preload(){
rabbit_running = loadAnimation("rabbit-clipart-md.png","rabbit-clipart-md (1).png","rabbit-clipart-md (2).png","rabbit-clipart-md (3).png","rabbit-clipart-md (4).png","rabbit-clipart-md (5).png","rabbit-clipart-md (6).png","rabbit-clipart-md (7).png")
rabbit_collided = loadAnimation("rabbit1.png","rabbit2.png")
foxImage = loadImage("leaping-red-fox-clipart-md (angry).png")

backgroundImg = loadImage("backgroundImg.png")


groundImage = loadImage("ground.png");

cloudImage = loadImage("cloud.png");

obstacle1 = loadImage("obstacle1.png");
obstacle2 = loadImage("obstacle2.png");
obstacle3 = loadImage("obstacle3.png");
obstacle4 = loadImage("obstacle4.png");

gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight)
    rabbit= createSprite(300,height-590,20,50);
    rabbit.addAnimation("running",rabbit_running);
    rabbit.addAnimation("collided",rabbit_collided)
    rabbit.setCollider('circle',0,0,350)
    rabbit.scale=0.1
    
    fox= createSprite(60,height-620,20,50)
    fox.addImage("fox",foxImage)
    fox.scale=0.3
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  visible=false

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;


  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
background(70)
  
//this line of code below is not neccessary
// invisibleGround=createSprite(200,620,300,25)
// invisibleGround.velocityX=-3
background(backgroundImg);
textSize(20);
fill("black")
text("Score: "+ score,30,50);


if (gameState===PLAY){
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX = -(6 + 3*score/100);
  
  if((touches.length > 0 || keyDown("SPACE")) && rabbit.y  >= height-120) {
    // jumpSound.play( )
    rabbit.velocityY = -10;
     touches = [];
  }
  
  if((touches.length > 0 || keyDown("SPACE")) && fox.y  >= height-200) {
    // jumpSound.play( )
    fox.velocityY = -10;
     touches = [];
  } 

  rabbit.velocityY = rabbit.velocityY + 0.8
fox.velocityY = fox.velocityY + 0.8
  if (ground.x < 0){
    ground.x = ground.width/2;
  }

rabbit.collide(invisibleGround);
fox.collide(invisibleGround)
  spawnClouds();
  spawnObstacles();

  if(obstaclesGroup.isTouching(rabbit)){
      // collidedSound.play()
      gameState = END;
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  
  
  ground.velocityX = 0;
  rabbit.velocityY = 0;
  rabbit.changeAnimation("collided", rabbit_collided)
  fox.velocityY = 0
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
  

  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  if(touches.length>0 || mousePressedOver(restart)) {      
    reset();
    touches = []
  }
}


drawSprites();
}

function spawnClouds() {
//write code here to spawn the clouds
if (frameCount % 60 === 0) {
  var cloud = createSprite(width+20,height-300,40,10);
  cloud.y = Math.round(random(100,220));
  cloud.addImage(cloudImage);
  cloud.scale = 0.5;
  cloud.velocityX = -3;
  
   //assign lifetime to the variable
  cloud.lifetime = 300;
  
  //adjust the depth
  cloud.depth = rabbit.depth;
  rabbit.depth = rabbit.depth+1;
  cloud.depth = fox.depth
  fox.depth = fox.depth+1
  //add each cloud to the group
  cloudsGroup.add(cloud);
}

}

function spawnObstacles() {
if(frameCount % 60 === 0) {
  var obstacle = createSprite(600,height-95,20,30);
  obstacle.setCollider('circle',0,0,45)
  // obstacle.debug = true

  obstacle.velocityX = -(6 + 3*score/100);
  
  //generate random obstacles
  var rand = Math.round(random(1,2,3,4));
  switch(rand) {
    case 1: obstacle.addImage(obstacle1);
            break;
    case 2: obstacle.addImage(obstacle2);
            break;
    case 3: obstacle.addImage(obstacle3)
            break
    case 4: obstacle.addImage(obstacle4)
    default: break;
  }
  
  //assign scale and lifetime to the obstacle           
  obstacle.scale = 0.3;
  obstacle.lifetime = 300;
  obstacle.depth = rabbit.depth;
  rabbit.depth +=1;
  obstacle.depth = fox.depth
  fox.depth+=1
  //add each obstacle to the group
  obstaclesGroup.add(obstacle);
}
}

function reset(){
gameState = PLAY;
gameOver.visible = false;
restart.visible = false;

obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();

rabbit.changeAnimation("running",rabbit_running);

score = 0;

}

