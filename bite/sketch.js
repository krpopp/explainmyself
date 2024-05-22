let sketch = function (p) {

    var winWidth;
    var winHeight;

    var topTeethNum = 5;
    var topTeethX 
    var topTeethY
    var topTeethRadius = 20;
    var topTeethOffset = 30;

    var botTeethnum = 5;
    var botTeethX 
    var botTeethY
    var botTeethRadius = 20
    var botTeethOffset = 30;

    var topTeeth = [];
    var botTeeth = [];

    const Gums = Symbol("gums");
    const Held = Symbol("held");
    const Released = Symbol("released");

    var hasTooth = false;

    var gravity = 0.2;

    var mouseSpeed = 0;

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        topTeethX = (winWidth / 2) - (topTeethNum * (topTeethOffset + topTeethRadius))/2;
        topTeethY = winHeight / 3;
        botTeethX = topTeethX;
        botTeethY = winHeight * 0.4;
    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        for(var i = 0; i < topTeethNum; i++) {
            topTeeth[i] = new p.Tooth(topTeethX + (topTeethOffset * i), topTeethY, topTeethRadius);
        }
        for(var i = 0; i < botTeethnum; i++) {
            botTeeth[i] = new p.Tooth(botTeethX + (botTeethOffset * i), botTeethY, botTeethRadius);
        }
    }

    p.draw = function () {
        p.background(0)
        for(var i = 0; i < topTeeth.length; i++) {
            topTeeth[i].draw();
        }
        for(var i = 0; i < botTeeth.length; i++) {
            botTeeth[i].draw();
        }
    }

    p.mouseDragged = function() {
        mouseSpeed = p.mouseX - p.pmouseX;
    }

    p.mousePressed = function() {
        if(!hasTooth) {
            for(var i = 0; i < topTeeth.length; i++) {
                if(topTeeth[i].checkCol()) {
                    break;
                }
            }
        }
        if(!hasTooth) {
            for(var i = 0; i < botTeeth.length; i++) {
                if(botTeeth[i].checkCol()) {
                    break;
                }
            }
        }
    }

    p.mouseReleased = function() {
        if(hasTooth) {
            for(var i = 0; i < topTeeth.length; i++) {
                topTeeth[i].checkRelease();
            }
            for(var i = 0; i < botTeeth.length; i++) {
                botTeeth[i].checkRelease();
            }
        }
    }

    p.Tooth = class {
        constructor(_x, _y, _r) {
            this.x = _x;
            this.y = _y;
            this.r = _r;
            this.red = 255;
            this.green = 255;
            this.blue = 255;
            this.held = false;
            this.state = Gums
            
            this.yVel = 0;
            this.yMax = 10;

            this.xVel = 0;
            this.xMax = 15;

            this.onGround = false;
            this.xDecel = 0.08;
        }

        draw(){
            switch(this.state) {
                case Held:
                    this.x = p.mouseX;
                    this.y = p.mouseY;
                    break;
                case Released:
                    this.physics();
                    break;
            }

            p.noStroke();
            p.fill(this.red, this.green, this.blue);
            p.ellipse(this.x, this.y, this.r);
        }

        checkCol() {
            if(p.mouseX < this.x + this.r/2 && p.mouseX > this.x - this.r/2 &&
                p.mouseY < this.y + this.r/2 && p.mouseY > this.y - this.r/2
            ) {
                hasTooth = true;
                console.log(hasTooth)
                this.state = Held
                return true;
            }
        }

        checkRelease() {
            if(this.state == Held) {
                hasTooth = false;
                this.state = Released
                this.yVel = 1;
                this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
            }
        }

        physics () {
            if(this.y < winHeight - this.r/2) {
                if(this.yVel < this.yMax) {
                    this.yVel+=gravity;
                }
                this.y += this.yVel;
                if(this.y >= winHeight - this.r/2) {
                    this.y = winHeight - this.r/2;
                    this.onGround = true;
                }
            }
            if(this.x < winWidth - this.r/2 && this.x > this.r/2) {
                if(this.onGround) {
                    this.xVel = this.xVel - (Math.sign(this.xVel) * this.xDecel);
                }
                this.x += this.xVel;
                if(this.x < this.r/2) {
                    this.x = this.r/2 + 2;
                    this.xVel = -this.xVel;
                    this.xVel *= 0.7
                }
                if(this.x > winWidth - this.r/2) {
                    this.x = winWidth - this.r/2 - 2;
                    this.xVel = -this.xVel; 
                    this.xVel *= 0.7
                }
            }
        }

    }

}