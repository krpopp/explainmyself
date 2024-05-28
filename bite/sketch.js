let sketch = function (p) {

    var winWidth;
    var winHeight;

    var debug = false;

    var topTeethNum = 6;
    var topTeethX 
    var topTeethY
    var topTeethW = [50, 50, 100, 100, 50, 50]
    var topTeethH = 150;
    //var topTeethRadius = 20;
    var topTeethOffset = [0, 50, 70, 80, 80, 75]
    //var topTeethOffset = 100;

    var botTeethnum = 6;
    var botTeethX 
    var botTeethY
    var botTeethW = [50, 50, 50, 50, 50, 50];
    var botTeethH = 150;
    //var botTeethRadius = 20
    var botTeethOffset = [60, 60, 60, 60, 60, 60]
    //var botTeethOffset = 100;

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
    var passiveMouseSpeed = 0;

    var teefsImg;
    var topSprites = [];
    var botSprites = [];

    var mouthX 
    var mouthY
    var mouthW
    var mouthH

    var inMouth = false;

    var topLipX1
    var topLipY1
    var topLipX2
    var topLipY2

    var topLipConX1
    var topLipConY1
    var topLipConX2
    var topLipConY2

    var topLipConX1Base
    var topLipConY1Base

    var topLipConX1Tar
    var topLipConY1Tar

    var topLipConX1Mod = 0
    var topLipConY1Mod = 0

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        topTeethX = (winWidth / 2) - (topTeethNum * 150)/2;
        topTeethY = winHeight / 3;
        botTeethX = topTeethX + 30;
        botTeethY = winHeight * 0.55;
        teefsImg = p.loadImage('teefs.png');
    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        p.imageMode(p.CENTER)
        for(var i = 0; i < topTeethNum; i++) {
            topSprites[i] = teefsImg.get(i * 150, 0, 150, 150)
            topTeeth[i] = new p.Tooth(topTeethX + (topTeethOffset[i] * i), topTeethY, topTeethW[i], topTeethH, i, true);
        }
        for(var i = 0; i < botTeethnum; i++) {
            botSprites[i] = teefsImg.get(i * 150, 150, 150, 150);
            botTeeth[i] = new p.Tooth(botTeethX + (botTeethOffset[i] * i), botTeethY, botTeethW[i], botTeethH, i, false);
        }
        mouthX = topTeethX - topTeethW[0]/2
        mouthY = topTeethY - topTeethH/2 - 20
        mouthW = 420
        mouthH = 340

        topLipX1 = topTeethX - topTeethW[0]/2
        topLipY1 = topTeethY - topTeethH/2
        topLipX2 = topTeethX - topTeethW[0]/2 + 420
        topLipY2 = topTeethY - topTeethH/2

        topLipConX1 = topLipX1 + 50
        topLipConY1 = topLipY1 + 180
        topLipConX2 = topLipX2 - 50
        topLipConY2 = topLipY2 + 180

        topLipConX1Base = topLipConX1
        topLipConY1Base = topLipConY1

        topLipConX1Tar = topLipConX1Base
        topLipConY1Tar = topLipConY1Base
    }

    p.draw = function () {
        p.background(234, 203, 210);
        p.fill(37, 40, 61);
        p.rect(mouthX, mouthY, mouthW, mouthH)
        p.fill(184, 72, 154)
        p.rect(topTeethX - topTeethW[0]/2, topTeethY - topTeethH/2 - 20, 420, 50);
        p.rect(botTeethX - botTeethW[0]/2, botTeethY + botTeethH/2 - 20, 360, 50);
        for(var i = 0; i < botTeeth.length; i++) {
            botTeeth[i].draw();
        }
        for(var i = 0; i < topTeeth.length; i++) {
            topTeeth[i].draw();
        }
        p.strokeWeight(100);
        //p.stroke(234, 203, 210);
        p.noFill();
        p.stroke(255);
        //p.line(topLipX1, topLipY1, topLipX2, topLipY2)
        p.curve(topLipConX1, topLipConY1, topLipX1, topLipY1, topLipX2, topLipY2, topLipConX2, topLipConY2);
        p.noStroke();

        p.fill(255, 0, 0);
        p.ellipse(topLipConX1, topLipConY1, 20)
        p.ellipse(topLipConX2, topLipConY2, 20)

        topLipConX1 = p.lerp(topLipConX1, topLipConX1Tar, 0.05)
        topLipConY1 = p.lerp(topLipConY1, topLipConY1Tar, 0.05)

        if(p.mouseX > topLipX1 && p.mouseX < topLipX1 + (topLipX2 - topLipX1)/2  && p.mouseY > topLipY1 - 50 && p.mouseY < topLipY1 + 150) {
            topLipConX1Mod = 50 * (-1 * (p.mouseX - p.pmouseX))
            topLipConY1Mod = 50 * (p.mouseY - p.pmouseY)
            topLipConX1Tar = topLipConX1Base + topLipConX1Mod
            topLipConY1Tar = topLipConY1Base + topLipConY1Mod
        } else {
            topLipConX1Tar = topLipConX1Base
            topLipConY1Tar = topLipConY1Base
        }
    }

    p.mouseDragged = function() {
        mouseSpeed = p.mouseX - p.pmouseX;
    }

    p.mouseMoved = function() {
        passiveMouseSpeed = p.mouseX - p.pmouseX;
        if(p.mouseX > mouthX && p.mouseX < mouthX + mouthW && p.mouseY > mouthY && p.mouseY < mouthY + mouthH) {
            inMouth = true;
        } else {
            inMouth = false;
        }
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
        constructor(_x, _y, _w, _h, _i, _t) {
            this.x = _x;
            this.y = _y;
            this.w = _w;
            this.h = _h;
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

            this.gumDist = 5;
            this.threadDist = 80;
            this.currDistX = 0;
            this.currDistY = 0;

            this.angle = p.PI / 4;
            this.aVel = 0.0;
            this.aAcc = 0.0;
            this.damp = 0.99;

            this.index = _i;
            this.isTop = _t;
        }

        draw() {
            if (this.state != Pulled && this.state != Released) {
                p.strokeWeight(30)
                p.stroke(184, 72, 154);
                if(this.isTop) {
                    p.line(this.startX, this.startY - (this.h/2), this.x, this.y - (this.h/2) + 20);
                } else  {
                    p.line(this.startX, this.startY + (this.h/2), this.x, this.y + (this.h/2));
                }
                
            }

            switch(this.state) {
                case Gums:
                    if(inMouth) {
                        this.currDistX = p.abs(this.startX - p.mouseX);
                        this.currDistY = p.abs(this.startY - p.mouseY);
                        if (this.currDistX >= 1) {
                            this.currDistX = 1;
                        }
                        if (this.currDistY >= 1) {
                            this.currDistY = 1;
                        }
                        var diffX = this.startX - p.mouseX;
                        var diffY = this.startY - p.mouseY;
                        this.angle = p.atan2(-1 * diffY, diffX) - p.radians(90);
                        //this.yVel += p.constrain(passiveMouseSpeed, -1, 1);
                        //this.xVel += p.constrain(passiveMouseSpeed, -1, 1);
                        this.threadPhysics();
                    }
                    break;
                case Held:
                    if (p.abs(mouseSpeed) > this.resist) {
                        this.state = ThreadedLoose;
                        this.yVel = 1;
                        this.xVel = p.constrain(mouseSpeed, -this.xMax, this.xMax);
                        hasTooth = false;
                        //this.state = Pulled;
                    } else {
                        this.currDistX = p.abs(this.startX - p.mouseX);
                        this.currDistY = p.abs(this.startY - p.mouseY);
                        if (this.currDistX >= this.gumDist) {
                            this.currDistX = this.gumDist;
                        }
                        if (this.currDistY >= this.gumDist) {
                            this.currDistY = this.gumDist;
                        }
                        var diffX = this.startX - p.mouseX;
                        var diffY = this.startY - p.mouseY;
                        this.angle = p.atan2(-1 * diffY, diffX) - p.radians(90);
                        this.threadPhysics();
                    }
                    break;
                case ThreadedLoose:
                    if (this.currDistY < this.threadDist) {
                        this.currDistY += 1;
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
            if(this.isTop) {
                p.image(topSprites[this.index], this.x, this.y)
            } else {
                p.image(botSprites[this.index], this.x, this.y)
            }
            if(debug) p.ellipse(this.x, this.y, this.w, this.h);
        }

        checkCol() {
            if(p.mouseX < this.x + this.w/2 && p.mouseX > this.x - this.w/2 &&
                p.mouseY < this.y + this.h/2 && p.mouseY > this.y - this.h/2
            ) {
                if (this.state == Gums) {
                    hasTooth = true;
                    this.state = Held
                    return true;
                    
                } else if (this.state == ThreadedLoose) {
                    hasTooth = true;
                    this.state = ThreadedHeld;
                    return true;
                } else if(this.state = Released) {
                    hasTooth = true;
                    this.state = Pulled
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
            if(this.y < winHeight - this.h/2) {
                if(this.yVel < this.yMax) {
                    this.yVel+=gravity;
                }
                this.y += this.yVel;
                if(this.y >= winHeight - this.h/2) {
                    this.y = winHeight - this.h/2;
                    this.onGround = true;
                }
            }
            if(this.x < winWidth - this.w/2 && this.x > this.w/2) {
                if(this.onGround) {
                    this.xVel = this.xVel - (Math.sign(this.xVel) * this.xDecel);
                }
                this.x += this.xVel;
                if(this.x < this.w/2) {
                    this.x = this.w/2 + 2;
                    this.xVel = -this.xVel;
                    this.xVel *= 0.7
                }
                if(this.x > winWidth - this.w/2) {
                    this.x = winWidth - this.w/2 - 2;
                    this.xVel = -this.xVel; 
                    this.xVel *= 0.7
                }
            }
        }

    }

}