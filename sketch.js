var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pipes1, pipes2, fb, fb2, bg, ground, coin;
var coinsGroup;
var pipe1Img, pipe2Img, fbImg, fb2Img, bgImg, groundImg, coinImg,restartImg;
var score = 0;
localStorage["highscore"] = 0;

function preload(){
  bgImg = loadImage("sprites/background.png");
  //pipesImg = loadImage("sprites/pipes.png");
  fbImg = loadImage("sprites/fb.png");
  fb2Img = loadImage("sprites/fb2.png");
  pipe1Img = loadImage("sprites/pipe1.png");
  pipe2Img = loadImage("sprites/pipe2.png");
  coinImg = loadImage("sprites/coin.png");
  restartImg = loadImage("sprites/restart.png");

  dieSound = loadSound("sounds/die.mp3");
  hitSound = loadSound("sounds/hit.mp3");
  pointSound = loadSound("sounds/point.mp3");
  wingSound = loadSound("sounds/wing.mp3");

  
}

function setup() {
  createCanvas(800,600);
  bg = createSprite(300,210,800,600);
  bg.addImage(bgImg);
  bg.scale = 1.8;
  //crop picture



  ground = createSprite(300,580,720,20);
  ground.visible = false;
  
  fb = createSprite(40,300);
  fb.addImage(fbImg);
  fb.scale = 0.2;
  fb.debug = true;
  fb.setCollider("circle",0,0,130);
  coinsGroup = new Group();
  pipes1Group = new Group();
  pipes2Group = new Group();

  restart = createSprite(400,300,20,30);
  restart.addImage(restartImg);
  restart.visible = false;
  console.log(restart.x);

 

  
  
}

function draw() {
  background(255);  

if(gameState === PLAY){

  bg.velocityX = -(4 + 3* score/100);  
  if (bg.x < 0){
    bg.x = bg.width/2;
  }

  if(keyDown("space")){
    fb.velocityY = -8;
    fb.addImage(fb2Img);
    wingSound.play();
  }

  spawnPipes1();
  spawnPipes2();
  spawnCoins();
  
//gravity
  fb.velocityY = fb.velocityY + 1;

  if(fb.isTouching(coinsGroup)){
    score += 10;
    coinsGroup.destroyEach();
    pointSound.play();
      }

  if(fb.isTouching(pipes2Group) || fb.isTouching(pipes1Group)){
    gameState = END;
    //hitSound.play();
    dieSound.play();

  }
}

else if(gameState === END){
  pipes1Group.setVelocityXEach(0);
  pipes2Group.setVelocityXEach(0);
  bg.velocityX = 0;
  pipes1Group.setLifetimeEach(-1);
  pipes2Group.setLifetimeEach(-1);
  fb.velocityY = 0;
  coinsGroup.setVelocityXEach(0);
  coinsGroup.setLifetimeEach(-1);
  restart.visible = true;

  if(mousePressedOver(restart)){
    reset();
  }

}
//collide ground in function draw
  fb.collide(ground);

  
  
  drawSprites();

  fill("white");
  textSize(20);
  text("Score: " + score, 660, 50);
  text("Highscore: " + localStorage["highscore"], 510,50)

}

function spawnPipes1(){
  if(frameCount % 60 === 0){
    pipes1 = createSprite(795,80,50,50);
    pipes1.addImage(pipe1Img);
    pipes1.velocityX = -(6 + score/100);
    pipes1.scale = 0.8;
    pipes1.depth = fb.depth;
    fb.depth += 1;
    pipes1.lifetime = 133;

    pipes1Group.add(pipes1);
    pipes1.debug = true;
    pipes1.setCollider("rectangle",0,0,80,300);
    
  }
}

function spawnPipes2(){
  if(frameCount % 60 === 0){
    pipes2 = createSprite(795,520,50,50); //add image
    pipes2.addImage(pipe2Img);
    pipes2.velocityX = -(6 + score/100);
    pipes2.scale = 0.8;
    pipes2.depth = fb.depth;
    fb.depth += 1;
    pipes2.lifetime = 133;
    pipes2Group.add(pipes2);
    pipes2.debug = true;
    pipes2.setCollider("rectangle",0,0,80,270);
    
  }
}

function spawnCoins(){
  if(frameCount % 100 === 0){
    coin = createSprite(795,10,50,50);
    coin.y = Math.round(random(230,370));
    coin.velocityX = -10;
    coin.scale = 0.08;
    coin.addImage(coinImg);
    coin.depth = fb.depth;
    fb.depth = fb.depth + 1; // fb2.depth += 1
    coin.lifetime = 80;
    coinsGroup.add(coin);
    coinsGroup.debug = true;

  }
}

function reset(){
  gameState = PLAY;
  coinsGroup.destroyEach();
  pipes2Group.destroyEach();
  pipes1Group.destroyEach();
  restart.visible = false;

  if(localStorage["highscore"] < score){
    localStorage["highscore"] = score;
  }
  score = 0;
}


