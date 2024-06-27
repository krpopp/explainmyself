let sketch = function (p) {

    var winWidth;
    var winHeight;

    var debug = false;

    var topTeethNum = 6;
    var topTeethX 
    var topTeethY
    var topTeethW = [50, 50, 50, 50, 50, 50]
    var topTeethH = 200;
    //var topTeethRadius = 20;
    var topTeethOffset = [0, 30, 35, 37, 37, 37]
    //var topTeethOffset = 100;

    var botTeethnum = 6;
    var botTeethX 
    var botTeethY
    var botTeethW = [50, 50, 50, 50, 50, 50];
    var botTeethH = 150;
    //var botTeethRadius = 20
    var botTeethOffset = [0, 34, 33, 32, 33, 35]
    //var botTeethOffset = 100;

    var topTeeth = [];
    var botTeeth = [];

    var throat;
    var uvula;
    var tongue;

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

    var topLip;
    var bottomLip;

    var topGums
    var bottomgums

    var state;

    const Oil = Symbol("oil");
    const Water = Symbol("water");

    var oilStateFrames = [];
    var oilStateIndex = 0;
    var oilStateProgress = 0;
    var oilStateRate = 3;
    var oilStateRight = true;

    var waterStateFrames = [];
    var waterStateIndex = 0;
    var waterStateProgress = 0;
    var waterStateRate = 3;

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        topTeethX = (winWidth / 2) - 90;
        topTeethY = winHeight / 5.8;
        botTeethX = topTeethX + 30;
        botTeethY = topTeethY + 150
        teefsImg = p.loadImage('teefs2.png');

        topGums = p.loadImage('topgums.png');
        bottomGums = p.loadImage("bottomgums.png")

        throat = p.loadImage('throat.png');
        uvula = p.loadImage('uvula.png');
        tongue = p.loadImage('tongue.png');

        for(var i = 0; i < 30; i++) {
            var num = i + 1;
            oilStateFrames[i] = p.loadImage('oil/oilipsframe' + num + '.png');
        }
        for(var i = 0; i < 18; i++) {
            var num = i + 1;
            waterStateFrames[i] = p.loadImage('water/open/waterlips' + num + '.png');
        }

        state = Oil;
    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        p.imageMode(p.CENTER)
        for(var i = 0; i < topTeethNum; i++) {
            topSprites[i] = teefsImg.get(i * 50, 0, 50, 100)
            topTeeth[i] = new p.Tooth(topTeethX + (topTeethOffset[i] * i), topTeethY, topTeethW[i], topTeethH, i, true);
        }
        for(var i = 0; i < botTeethnum; i++) {
            botSprites[i] = teefsImg.get(i * 50, 100, 50, 100);
            botTeeth[i] = new p.Tooth(botTeethX + (botTeethOffset[i] * i), botTeethY, botTeethW[i], botTeethH, i, false);
        }
        mouthX = topTeethX - topTeethW[0]/2
        mouthY = topTeethY - topTeethH/2 - 20
        mouthW = 480
        mouthH = 340

        topLip = new p.Lip(topTeethX - topTeethW[0]/1.5, topTeethY, topTeethX - topTeethW[0]/2 + 430, topTeethY, 0, -50);
        bottomLip = new p.Lip(botTeethX - botTeethW[0]/0.7, botTeethY, botTeethX - botTeethW[0]/2 + 400, botTeethY, winHeight, 50);
    }

    p.draw = function () {
        p.background(0);
        p.noStroke();

        switch(state) {
            case Oil: 
                p.image(oilStateFrames[oilStateIndex], winWidth/2, winHeight/2);
                if(p.mouseX > p.pmouseX && oilStateRight) {
                    if(oilStateIndex < oilStateFrames.length - 1) {
                        //oilStateIndex++;
                        oilStateProgress++;
                        if(oilStateProgress % oilStateRate == 0) {
                            oilStateIndex++;
                        }
                        if(oilStateIndex >= 16) {
                            oilStateRight = false;
                        }
                    }
                } else if(p.mouseX < p.pmouseX && !oilStateRight) {
                    if(oilStateIndex < oilStateFrames.length - 1) {
                        oilStateProgress++;
                        if(oilStateProgress % oilStateRate == 0) {
                            oilStateIndex++;
                        }
                    } else {
                        state = Water;
                    }
                }
                break;
            case Water:
                p.image(throat, topTeethX+90, topTeethY+ 50);
                p.image(uvula, topTeethX + 100, topTeethY + 20);
                p.image(tongue, topTeethX + 110, topTeethY + 120);
                for (var i = 0; i < topTeeth.length; i++) {
                    topTeeth[i].draw();
                }
                p.image(topGums, topTeethX + 94, topTeethY - 20)
                
                for(var i = 0; i < botTeeth.length; i++) {
                    botTeeth[i].draw();
                }
                p.image(bottomGums, botTeethX + 80, botTeethY + 17)
                p.image(waterStateFrames[waterStateIndex], winWidth/2, winHeight/2);
                var centerDist = p.dist(p.mouseX, p.mouseY, topTeethX + 100, topTeethY + 20);
                centerDist = p.round(centerDist);
                console.log(centerDist);
                waterStateIndex = p.constrain(waterStateFrames.length - centerDist, 0, waterStateFrames.length);
                
                break;
        }


        // p.fill(37, 40, 61);
        // //p.rect(mouthX, mouthY, mouthW, mouthH)
        // p.ellipse(mouthX + 210, mouthY + 165, mouthW, mouthH)
        // p.fill(184, 72, 154)
        // p.image(topGums, topTeethX + 180, topTeethY - 40)
        // p.image(bottomGums, botTeethX + 150, botTeethY + 40)
        // //p.rect(topTeethX - topTeethW[0]/2, topTeethY - topTeethH/2 - 20, 420, 50);
        // p.rect(botTeethX - botTeethW[0]/2, botTeethY + botTeethH/2 - 20, 360, 50);
        // for (var i = 0; i < botTeeth.length; i++) {
            
        //     if (botTeeth[i].state == Gums) {
        //         botTeeth[i].veinDraw();
        //         botTeeth[i].draw();
        //     }
        // }
        // for (var i = 0; i < topTeeth.length; i++) {
        //     topTeeth[i].veinDraw();
        //     if(topTeeth[i].state == Gums) topTeeth[i].draw();
        // }

        // topLip.touch();
        // topLip.draw();
       
        // bottomLip.touch();
        // bottomLip.draw();

        // for(var i = 0; i < botTeeth.length; i++) {
        //     if (botTeeth[i].state != Gums) {
        //         botTeeth[i].veinDraw();
        //         botTeeth[i].draw();
        //     }
        // }
        // for(var i = 0; i < topTeeth.length; i++) {
        //     if(topTeeth[i].state != Gums) topTeeth[i].draw();
        // }
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

    p.Lip = class {
        constructor(_x1, _y1, _x2, _y2, _anchorY1, _conY){
            this.firstVec = p.createVector(_x1, _y1);
            this.secondVec = p.createVector(_x2, _y2);
            this.firstCon = p.createVector(_x1 + 80, _y1 + _conY)
            this.secondCon = p.createVector(_x2 - 50, _y2 + _conY)

            this.firstConBase = p.createVector(_x1 + 80, _y1 + _conY)
            this.firstConTar = p.createVector(_x1 + 80, _y1 + _conY)
            this.firstConMod = p.createVector(0, 0)

            this.secondConBase = p.createVector(_x2 - 50, _y2 + _conY)
            this.secondConTar = p.createVector(_x2 - 50, _y2 + _conY)
            this.secondConMod = p.createVector(0, 0)

            this.anchorY = _anchorY1;
        }

        draw() {
            //p.fill(0);
            p.fill(234, 203, 210);
            p.beginShape();
            p.vertex(0, this.anchorY);
            p.vertex(this.firstVec.x, this.firstVec.y);
            p.bezierVertex(this.firstCon.x, this.firstCon.y, this.secondCon.x, this.secondCon.y, this.secondVec.x, this.secondVec.y)
            p.vertex(winWidth, this.anchorY)
            p.endShape();

            p.fill(255, 0, 0);
            //p.ellipse(this.firstCon.x, this.firstCon.y, 20)
            //p.ellipse(this.secondCon.x, this.secondCon.y, 20)
        }

        touch() {

            this.firstCon.x = p.lerp(this.firstCon.x, this.firstConTar.x, 0.05)
            this.firstCon.y = p.lerp(this.firstCon.y, this.firstConTar.y, 0.05)

            this.secondCon.x = p.lerp(this.secondCon.x, this.secondConTar.x, 0.05)
            this.secondCon.y = p.lerp(this.secondCon.y, this.secondConTar.y, 0.05)
    
            if(p.mouseX > this.firstVec.x && p.mouseX < this.firstVec.x + (this.secondVec.x - this.firstVec.x)/2  && p.mouseY > this.firstVec.y - 50 && p.mouseY < this.firstVec.y + 150) {
                var diff = p.constrain(p.abs(this.firstConBase.y - p.mouseY) / 100, 0, 1)
                diff = 1 - diff
                this.firstConMod.y = (100 * diff) * Math.sign(this.firstConBase.y - p.mouseY);
                //this.firstConTar.x = this.firstConBase.x + this.firstConMod.x
                this.firstConTar.y = this.firstConBase.y + this.firstConMod.y
            } else {
                this.firstConTar.set(this.firstConBase)
            }

            if(p.mouseX > this.secondVec.x - (this.secondVec.x - this.firstVec.x)/2 && p.mouseX < this.secondVec.x && p.mouseY > this.secondVec.y - 50 && p.mouseY < this.secondVec.y + 150){
                var diff = p.constrain(p.abs(this.secondConBase.y - p.mouseY) / 100, 0, 1)
                diff = 1 - diff
                this.secondConMod.y = (100 * diff) * Math.sign(this.secondConBase.y - p.mouseY);
                this.secondConTar.y = this.secondConBase.y + this.secondConMod.y
            } else {
                this.secondConTar.set(this.secondConBase)
            }
        }
    }

    p.Tooth = class {
        constructor(_x, _y, _w, _h, _i, _t) {
            this.pos = p.createVector(_x,_y);
            this.size = p.createVector(_w, _h)
            this.red = 255;
            this.green = 255;
            this.blue = 255;
            this.held = false;
            this.state = Gums
            
            this.vel = p.createVector(0, 0);
            this.maxVel = p.createVector(15, 10);

            this.onGround = false;
            this.xDecel = 0.08;

            this.resist = 20;
            this.break = 50;

            this.startPos = p.createVector(_x, _y);

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

            this.veinSize = 20;

        }

        update() {
            switch(this.state) {
                case Gums:
                    this.startDistCheck(1);
                    break;
                case Held:
                    if (p.abs(mouseSpeed) > this.resist) {
                        this.state = ThreadedLoose;
                        this.vel.set(p.constrain(mouseSpeed, -this.maxVel.x, this.maxVel.x), 1);
                        hasTooth = false;
                    } else {
                        this.startDistCheck(this.gumDist);
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
                    break;
                case ThreadedHeld:
                    if (p.abs(mouseSpeed) > this.break) {
                        this.state = Released;
                        hasTooth = false;
                        this.vel.set(p.constrain(mouseSpeed, -this.maxVel.x, this.maxVel.x), 1);
                    } else {
                        this.startDistCheck(this.threadDist);
                    }
                    break;
                case Pulled:
                    this.pos.set(p.mouseX, p.mouseY);
                    break;
                case Released:
                    
                    break;
            }
            this.physics();
        }

        veinDraw() {
            if (this.state != Pulled && this.state != Released) {
                var diff = p.constrain(p.abs(this.startPos.dist(this.pos)) / this.threadDist, 0, 1)
                diff = 1 - diff
                this.veinSize =  2 + (20 * diff) * Math.sign(this.startPos.dist(this.pos));
                
                p.strokeWeight(this.veinSize)
                p.stroke(235, 52, 52);
                if(this.isTop) {
                    p.line(this.startPos.x, this.startPos.y - (this.size.y/7), this.pos.x, this.pos.y - (this.size.y/2) + 20);
                } else  {
                    p.line(this.startPos.x, this.startPos.y + (this.size.y/10), this.pos.x, this.pos.y + (this.size.y/2));
                }
                
            }
        }

        draw() {
           this.update();
            p.noStroke();
            p.fill(this.red, this.green, this.blue);
            if(this.isTop) {
                p.image(topSprites[this.index], this.pos.x, this.pos.y)
            } else {
                p.image(botSprites[this.index], this.pos.x, this.pos.y)
            }
            if(debug) p.ellipse(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        startDistCheck(distReset) {
            this.currDistX = p.abs(this.startPos.x - p.mouseX);
            this.currDistY = p.abs(this.startPos.y - p.mouseY);
            if (this.currDistX >= distReset) {
                this.currDistX = distReset;
            }
            if (this.currDistY >= distReset) {
                this.currDistY = distReset;
            }
            this.angle = p.atan2(-1 * (this.startPos.y - p.mouseY), this.startPos.x - p.mouseX) - p.radians(90);
        }

        checkCol() {
            if(p.mouseX < this.pos.x + this.size.x/2 && p.mouseX > this.pos.x - this.size.x/2 &&
                p.mouseY < this.pos.y + this.size.y/2 && p.mouseY > this.pos.y - this.size.y/2
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
                this.vel.set(p.constrain(mouseSpeed, -this.maxVel.x, this.maxVel.x), 1);
            } else if (this.state == ThreadedHeld) {
                this.state = ThreadedLoose;
                this.vel.set(p.constrain(mouseSpeed, -this.maxVel.x, this.maxVel.x), 1);
                hasTooth = false;
            }
        }

        threadPhysics() {
        }

        physics () {
            if(this.state == Released){
                if(this.pos.x < winWidth - this.size.x/2 && this.pos.x > this.size.x/2) {
                    if(this.onGround) {
                        this.vel.x = this.vel.x - (Math.sign(this.vel.x) * this.xDecel);
                    }

                } else {
                    this.vel.x = 0;
                    if(this.pos.x < this.size.x/2) {
                        this.pos.x = this.size.x/2 + 2;
                    }
                    if(this.pos.x > winWidth - this.size.x/2) {
                        this.pos.x = winWidth - this.size.x/2 - 2;
                    }
                }
                if(this.pos.y < winHeight - this.size.y/2) {
                    if(this.vel.y < this.maxVel.y) {
                        this.vel.y+=gravity;
                    }
                } else {
                    this.vel.y = 0;
                    this.onGround = true;
                    if(this.pos.y >= winHeight - this.size.y/2) {
                        this.pos.y = winHeight - this.size.y/2;
                    }
                }
                this.pos.add(this.vel)
            } else if(this.state != Pulled) {
                this.pos.x = this.currDistX * p.sin(this.angle);
                this.pos.y = this.currDistY * p.cos(this.angle);
                this.pos.add(this.startPos);
            }
        }

    }

}