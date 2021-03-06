var canvas = document.getElementById("holder");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var stage = "version 3.4"
var game = new Game();
var enemyX = game.tank.x;
var enemyY = game.tank.y;



function Tank(x, y, which) {
  this.x = x;
  this.y = y;
  this.bullets = [];
  this.tankimg = new Image();
  this.tankimg.src = 'tank1.png';
  this.tankimg2 = new Image();
  this.tankimg2.src = "tankIN.png"
  this.ammo = 15;
  this.health = 100;
  this.message = "You Died"
  this.which = which;
  this.hasCollided = false;
}

function Bullet(x, y) {
  this.x = x;
  this.y = y;
}

Tank.prototype.draw = function () {
  if (this.which == 1) {
    ctx.drawImage(this.tankimg, this.x, this.y, 100, 100);
  } else if (this.which == 2) {
    ctx.drawImage(this.tankimg2, this.x, this.y, 100, 100);
  }

}



Tank.prototype.moveDown = function () {
  this.y += 3;
}

Tank.prototype.moveRight = function () {
  this.x += 3;
}

Tank.prototype.moveLeft = function () {
  this.x -= 3;
}
Tank.prototype.moveUp = function () {
  this.y -= 3;
}


Bullet.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI)
  ctx.fill();
}

Bullet.prototype.fire = function () {
  this.x += 5;
}

Bullet.prototype.checkCollision = function (enemytank) {

  if (this.x >= enemytank.x && this.x <= enemytank.x + 60 && this.y >= enemytank.y && this.y <= enemytank.y + 40) {
    return true;
    enemytank.health -= 5;
  }
  return false;
}

Tank.prototype.shoot = function () {
  if (this.ammo > 0) {
    this.ammo--;
    this.bullets.push(new Bullet(this.x + 95, this.y + 53));
  } else {
    setTimeout(function () {
      this.ammo = 15;
    }.bind(this), 5000);
  }
}

Tank.prototype.touchingwall = function () {
  if (this.y <= -16.75) {
    this.y += 20;
    this.health -= 5;
    this.hasCollided = true;
    if (this.health == 5) {


    }
  }

  if (this.y >= 115) {
    this.y -= 20;
    this.health -= 5;
    this.hasCollided = true;
    if (this.health == 5) {

    }

  }

  if (this.x <= -16.75) {
    this.x += 20;
    this.health -= 5;
    this.hasCollided = true;
    if (this.health == 5) {

    }

  }

  if (this.x >= 245) {
    this.x -= 20;
    this.health -= 5;
    this.hasCollided = true;
    if (this.health == 5) {

    }

  }
}

function AggressiveAI(tank) {
  this.aI = tank;
  this.aiDirection = "Left";
  this.interval2 = setInterval(function () {
    this.changeDirectionOfAI();
  }.bind(this), 1000)
}
AggressiveAI.prototype.moveAI = function () {
  this.aI.draw();
  this.aI.touchingwall();
  if (this.aI.hasCollided) {
    this.changeDirectionOfAI();
    this.aI.hasCollided = false;
  }

  switch (this.aiDirection) {
    case "Left": this.aI.moveLeft(); break;
    case "Right": this.aI.moveRight(); break;
    case "Up": this.aI.moveUp(); break;
    case "Down": this.aI.moveDown(); break;
  }


}

AggressiveAI.prototype.changeDirectionOfAI = function () {
  var randomPick = Math.floor(Math.random() * 3);  // number between 0 and 3
  var validDirections = ["Left", "Right", "Up", "Down"].filter(element => element != this.aiDirection);
  this.aiDirection = validDirections[randomPick];
}


function EvasiveAI(tank) {

  this.aI = tank;
  this.aiDirection = "Left";
  this.interval2 = setInterval(function () {
    this.changeDirectionOfAI();
  }.bind(this), 2000)

}
EvasiveAI.prototype.moveAI = function () {
  this.aI.draw();
  this.aI.touchingwall();
  if (this.aI.hasCollided) {
    this.changeDirectionOfAI();
    this.aI.hasCollided = false;
  }

  switch (this.aiDirection) {
    case "Left": this.aI.moveLeft(); break;
    case "Right": this.aI.moveRight(); break;
    case "Up": this.aI.moveUp(); break;
    case "Down": this.aI.moveDown(); break;
  }


}
EvasiveAI.prototype.changeDirectionOfAI = function () {
  var randomPick = Math.floor(Math.random() * 3);  // number between 0 and 3
  var validDirections = ["Left", "Right", "Up", "Down"].filter(element => element != this.aiDirection);
  this.aiDirection = validDirections[randomPick];
}

function Game() {
  this.tank = new Tank(10, 10, 1);
  this.aI = new Tank(200, 50, 2);
  this.aI2 = new Tank(200, 150, 2);
  this.aIManager = new EvasiveAI(this.aI);
  this.aIManager2 = new AggressiveAI(this.aI2);

  document.addEventListener("keydown", (e) => {
    var x = e.keyCode;
    if (x == 83 || x == 40) {
      this.tank.moveDown();
    } else if (x == 68 || x == 39) {
      this.tank.moveRight();
    } else if (x == 87 || x == 38) {
      this.tank.moveUp();
    } else if (x == 65 || x == 37) {
      this.tank.moveLeft();
    } else if (x == 32) {
      this.tank.shoot()
    }
  });
}

Game.prototype.run = function () {
  this.interval = setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black";
    this.tank.draw();
    this.tank.touchingwall();
    ctx.font = "9px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`Ammo: ${this.tank.ammo}`, 275, 10);
    ctx.fillText(`Health: ${this.tank.health}`, 30, 10)
    for (var i = 0; i < this.tank.bullets.length; i++) {
      if (this.tank.bullets[i].checkCollision(this.aI)){
        this.tank.bullets.splice(i, 1);
        console.log("Bullet Hit tank 1");
      } else if (this.tank.bullets[i].checkCollision(this.aI2)) {
        this.tank.bullets.splice(i, 1);
        console.log("Bullet Hit tank 2");
      } else {
        this.tank.bullets[i].draw();
        this.tank.bullets[i].fire();
        if (this.tank.bullets[i].x < 0 || this.tank.bullets[i].x > canvas.width) {
          this.tank.bullets.shift();
        }
      }

    }

    if (this.tank.health <= 0) {
      setInterval(function () {
        ctx.beginPath()
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(``, canvas.width / 2, canvas.height / 2);
      })
      clearInterval(this.interval)
      clearInterval(this.interval2)
    }

    if (this.aI != null) {

      if (this.aI.health <= 0) {
        this.aI = null;
      }

    }

    if (this.aI2 != null) {

      if (this.aI2.health <= 0) {
        this.aI2 = null;
      }
    }

    this.aIManager.moveAI();
    this.aIManager2.moveAI();

  }.bind(this), 80);


}




ctx.font = "40px Comic Sans MS";
ctx.fillStyle = "green";
ctx.textAlign = "center";
ctx.fillText(`TankWars ${stage}`, canvas.width / 2, canvas.height / 2);
ctx.fillStyle = "red";
ctx.font = "20px Permanent Marker";
ctx.fillText("Click to begin!", (canvas.width / 2) + 5, (canvas.height / 2) + 20)

addEventListener("click", function () {
  game.run();
});