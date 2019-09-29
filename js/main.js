var game = new Phaser.Game(800, 460, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render, resize: resize });
function preload() {

    game.load.tilemap('map', 'assets/maps/hsFinMap.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/maps/Horizon_Song-Tiles.png');

    game.load.spritesheet('dude', 'assets/maps/nmmPC.png', 32, 32);
    game.load.image('background', 'assets/maps/hsMapBack.png');

    game.load.spritesheet('goon', 'assets/maps/nmmPC.png', 32, 32);
    
    //game.load.image('lazer', 'assets/maps/lazer.png', 12, 7);
}
var upKey;
var leftKey;
var rightKey;
var downKey;

var player;
var facing = 'left';

//var order;
//var oFacing = 'oLeft';

var jumpTimer = 0;
var jumpButton;

var kickKey;
var kickTime = 0;

var map;
var platLayer;
var bg;

//var lazers;
//var lazerTime; 
//var shootKey;
//var aim;

function create() {

    window.addEventListener('resize', resize);
    resize();

    bg = game.add.tileSprite(0, 0, 960, 10000, 'background');
    bg.fixedToCamera = true;

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 32, 32);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Create our layer
    platLayer = map.createLayer(0);

    //  Resize the world
    platLayer.resizeWorld();

    map.setCollision([0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 16, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

  game.renderer.clearBeforeRender = false;
  game.renderer.roundPixels = true;

  game.input.mouse.capture = true;

  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  
  kickKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
  
  //shootKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(42, 383, 'dude');
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.collideWorldBounds = true;
  player.body.gravity.y = 1000;
  player.body.maxVelocity.y = 800;
  player.body.setSize(16, 32, 8, 0);

  player.animations.add('left', [3, 2, 1, 0], 12, true);
  player.animations.add('turn', [5], 20, true);
  player.animations.add('right', [7, 8, 9, 10], 12, true);
  
  //Player kick
  player.animations.add('kLeft', [15, 14, 13, 12, 11], 18, true);
  player.animations.add('kRight', [17, 18, 19, 20, 21], 18, true);

/**
  order = game.add.sprite(260, 19, 'goon');
  order.anchor.set(0.5);
  game.physics.enable(order, Phaser.Physics.ARCADE);

  order.body.collideWorldBounds = true;
  order.body.gravity.y = 1000;
  order.body.maxVelocity.y = 800;
  order.body.setSize(16, 32, 8, 0);

  order.animations.add('oLeft', [0, 1, 2], 14, true);
  order.animations.add('oTurn', [3], 20, true);
  order.animations.add('oRight', [4, 5, 6], 14, true);
**/

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.04, 0.04);
  
/**
    // Our bullet group
    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;
    lazers.createMultiple(30, 'lazer');
    lazers.setAll('anchor.x', 0.5);
    lazers.setAll('anchor.y', 1);
    lazers.setAll('outOfBoundsKill', true);
    lazers.setAll('checkWorldBounds', true);
**/
  
/** 
    lazer = game.add.weapon(1, 'bolt');
    //  The bullet will be automatically killed when it leaves the world bounds
    lazer.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    lazer.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    lazer.bulletKillDistance = 80;
    
    lazer.enableBody = true;

    lazer.physicsBodyType = Phaser.Physics.ARCADE;
//game.physics.enable(lazer, Phaser.Physics.ARCADE);

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    lazer.bulletAngleOffset = 180;
    

    //  The speed at which the bullet is fired
    lazer.bulletSpeed = 800;
    
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    lazer.trackSprite(player, 0, 0);
    //lazer.fireAngle = aim;
**/

}
function update() {

  var px = player.body.position.x;
  var py = player.body.position.y;
 
/** 
  var ox = order.body.position.x;
  var oxr = ox - 66;
  var oxl = ox + 66;
  var oy = order.body.position.y;
  var oys = oy - 140;


  order.body.velocity.x = 0;

  var ordPlatform = game.physics.arcade.collide(order, platLayer);


//enemy AI


  if(px < oxr && py > oys) {
	order.body.velocity.x = -100;
        if (oFacing != 'oLeft') {
          order.animations.play('oLeft');
          oFacing = 'oLeft';
        }
  }

  else if(px > oxl && py > oys) {
    order.body.velocity.x = 100;

    if(oFacing != 'oRight')
    {
      order.animations.play('oRight');
      oFacing = 'oRight';
    }
  }
  else {
    if(oFacing != 'oIdle')
    {
      order.animations.stop();

      if (oFacing == 'oLeft')
      {
        order.frame = 3;
      }
      else
      {
        order.frame = 3;
      }

      oFacing = 'oIdle';
    }
  }
  
  if(order.body.onWall()) {
        order.body.velocity.y = -400;
        jumpTimer = game.time.now + 750;
  }
**/

//player controls

  var hitPlatform = game.physics.arcade.collide(player, platLayer);

  player.body.velocity.x = 0;
  
  
  //die respawn
  if(player.body.position.y > 668) {
  	player.body.position.x = 42;
  	player.body.position.y = 383;
  }
    
  //shoot
  
  //var shootWall = game.physics.arcade.collide(lazer, platLayer);
 
/**  
  if (shootKey.isDown)
  {
      //lazer.fire();
      fireLazer();
  }
 **/

  //player kick
  if(kickKey.isDown && facing == 'left') {
      player.animations.play('kLeft');
      facing = 'left';
      //player.animations.stop('kLeft');
  }

  else if(kickKey.isDown) {
      kickTime = game.time.now + 260;
      if(kickTime > game.time.now && facing == 'right') {
           player.animations.play('kRight');
           //facing = 'right';
           //player.animations.stop('kRightt');
      }
  }

  //player move
  //left
  else if(leftKey.isDown) {
    player.body.velocity.x = -110;
    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  }
  /**
  else if(leftKey.isDown && player.body.touching.down == false) {
  	player.body.velocity.x = -110;
  	if(facing != 'left') {
  		player.frame = 2;
  	}
  	facing = 'left';
  }
  **/
  //player move
  //right
  else if(rightKey.isDown) {
    player.body.velocity.x = 110;
    if (facing != 'right') {
      player.animations.play('right');
      facing = 'right';
    }
    facing = 'right';
  }
  /**
  else if(rightKey.isDown && player.body.onFloor() == false) {
  	player.body.velocity.x = 110;
  	if(facing != 'right') {
  		player.frame = 8;
  	}
  	facing = 'right';
  }
  **/
  //player move
  //idle
  else {
    if (facing != 'idle') {
      player.animations.stop();

      if (facing == 'left') {
        player.frame = 4;
      }
      else {
        player.frame = 6;
      }

      facing = 'idle';
    }
  }
  
    if (jumpButton.isDown && hitPlatform && player.body.onFloor()) {
        player.body.velocity.y = -400;
        jumpTimer = game.time.now + 750;
    }
    
/**
    if(facing == 'left') {
    	aim = Phaser.ANGLE_LEFT;
    }
    if(facing == 'right') {
    	aim = Phaser.ANGLE_RIGHT;
    }
**/
    
    /**
    lazer.fireAngle = aim;
    
    if(shootWall) {
    	lazer.kill();
    }
    **/
    
    //!!BROKEN wall jump!!
    /**
    if (jumpButton.isDown && hitPlatform && player.body.onWall()) {
        player.body.velocity.y = -300;
        player.body.velocity.x = -2000;
        jumpTimer = game.time.now + 950;

    }
     if (jumpButton.isDown && hitPlatform == false && player.body.onWall()) {
        player.body.velocity.y = -300;
        player.body.velocity.x = 2000;
        jumpTimer = game.time.now + 950;
    }
    **/
    
        //game.physics.arcade.overlap(lazers, order, collisionHandler, null, this);
        //game.physics.arcade.overlap(lazers, platLayer, collisionHandler, null, this);
}

/**
function collisionHandler (lazer, platLayer) {

    lazer.kill();

}

function fireLazer() {
    //  To avoid them being allowed to fire too fast we set a time limit
    if(game.time.now > lazerTime)
    {
        //  Grab the first bullet we can from the pool
        lazer = lazers.getFirstExists(false);

        if(lazer)
        {
            //  And fire it
            lazer.reset(player.x, player.y + 8);
            lazer.body.velocity.y = -400;
            lazerTime = game.time.now + 200;
        }
    }
}
**/

function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

function render() {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    game.debug.bodyInfo(player, 16, 24);

}
