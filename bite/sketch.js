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
    const ThreadedLoose = Symbol("stringed");
    const ThreadedHeld = Symbol("heldStringed")
    const Pulled = Symbol("pulled");
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

            this.resist = 20;
            this.break = 50;

            this.startX = _x;
            this.startY = _y;

            this.threadDist = 40;
            this.currDistX = 0;
            this.currDistY = 0;

            this.angle = p.PI / 4;
            this.aVel = 0.0;
            this.aAcc = 0.0;
            this.damp = 0.99;
        }

        draw() {
            if (this.state != Pulled && this.state != Released) {
                p.strokeWeight(4)
                p.stroke(255, 0, 0);
                p.line(this.startX, this.startY, this.x, this.y);
            }

            switch(this.state) {
                case Held:
                    if (p.abs(mouseSpeed) > this.resist) {
                        this.state = ThreadedLoose;
                        this.yVel = 1;
                        this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
                        hasTooth = false;
                        //this.state = Pulled;
                    }
                    break;
                case ThreadedLoose:
                    if (this.currDistY < this.threadDist) {
                        this.currDistY += 1;
                        // if (this.currDistY >= this.threadDist) {
                        //     this.currDistY = 40;
                        //     console.log("hi")
                        //     this.term = true;
                        // }
                    }
                    this.aAcc = (-1 * gravity / this.currDistY) * p.sin(this.angle);
                    this.aVel += this.aAcc;
                    this.aVel *= this.damp;
                    this.angle += this.aVel;
                    this.threadPhysics();
                    break;
                case ThreadedHeld:
                    if (p.abs(mouseSpeed) > this.break) {
                        this.state = Released;
                        hasTooth = false;
                        this.yVel = 1;
                        this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
                    } else {
                        this.currDistX = p.abs(this.startX - p.mouseX);
                        this.currDistY = p.abs(this.startY - p.mouseY);
                        if (this.currDistX >= this.threadDist) {
                            this.currDistX = this.threadDist;
                        }
                        if (this.currDistY >= this.threadDist) {
                            this.currDistY = this.threadDist;
                        }
                        var diffX = this.startX - p.mouseX;
                        var diffY = this.startY - p.mouseY;
                        this.angle = p.atan2(-1 * diffY, diffX) - p.radians(90);
                        this.threadPhysics();
                        // this.x = p.mouseX;
                        // if (p.abs(this.x - this.startX) > this.threadDist) {
                        //     var sign = Math.sign(this.x - this.startX)
                        //     this.x = (this.startX + (sign * this.threadDist)) - sign;
                        // } 
                        // this.y = p.mouseY;
                        // if (p.abs(this.y - this.startY) > this.threadDist) {
                        //     var sign = Math.sign(this.y - this.startY)
                        //     this.y = (this.startY + (sign * this.threadDist)) - sign;
                        // }
                    }
                    break;
                case Pulled:
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
                if (this.state == Gums) {
                    hasTooth = true;
                    this.state = Held
                    return true;
                    
                } else if (this.state == ThreadedLoose) {
                    hasTooth = true;
                    this.state = ThreadedHeld;
                    return true;
                }
            } else {
                return false;
            }
        }

        checkRelease() {
            if (this.state == Held) {
                hasTooth = false;
                this.state = Gums;
            } else if (this.state == Pulled) {
                hasTooth = false;
                this.state = Released
                this.yVel = 1;
                this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
            } else if (this.state == ThreadedHeld) {
                this.state = ThreadedLoose;
                this.yVel = 1;
                this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
                hasTooth = false;
            }
        }

        threadPhysics() {
    
            this.x = this.currDistX * p.sin(this.angle);
            this.y = this.currDistY * p.cos(this.angle);
            this.x += this.startX;
            this.y += this.startY;
            

            // if(this.y < winHeight - this.r/2) {
            //     if(this.yVel < this.yMax) {
            //         this.yVel+=gravity;
            //     }
            //     // if(this.y >= winHeight - this.r/2) {
            //     //     this.y = winHeight - this.r/2;
            //     //     this.onGround = true;
            //     // }
            //     if (this.y - this.startY < this.threadDist) {
            //         this.y += this.yVel;
            //     }
            // }
            // if(this.x < winWidth - this.r/2 && this.x > this.r/2) {
            //     if(this.onGround) {
            //         this.xVel = this.xVel - (Math.sign(this.xVel) * this.xDecel);
            //     }
            //     if (p.abs(this.x - this.startX) < this.threadDist) {
            //         this.x += this.xVel;
            //     }
            //     if (this.x < this.startX - this.threadDist) {
            //         console.log("limit left")
            //         this.x = (this.startX - this.threadDist) + 2;
            //         this.xVel = -this.xVel;
            //         this.xVel *= 0.3
            //     }
            //     if(this.x > this.startX + this.threadDist) {
            //         this.x = (this.startX + this.threadDist) - 2;
            //         this.xVel = -this.xVel; 
            //         this.xVel *= 0.3
            //     }
            // }
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