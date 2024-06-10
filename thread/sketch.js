let sketch = function (p) {

    //to do
    //replace shapes with photos

    var winWidth;
    var winHeight;

    var debug = false;

    var eye;

    var mousePos

    var eyeWatchDist = 300;

    var topLashes = [];

    var hasLash = false;

    var looseThreads = 1;

    var distCanMove = 20;

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
       
    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        eye = new p.Eye(winWidth / 2, winHeight / 2, 280);
        mousePos = p.createVector(winWidth / 2, winWidth / 2);
        for (var i = 0; i < 15; i++) {
            topLashes[i] = new p.Lash((eye.pos.x - eye.dia/2) + (i * 20), eye.pos.y - eye.dia/1.4, 50, i)
        }
    }

    p.draw = function () {
        p.background(154, 122, 160);
        eye.draw();
        eye.update();

        for (var i = 0; i < topLashes.length; i++) {
            topLashes[i].draw();
        }

        if(hasLash) {
            p.unWind();
        }
    }

    p.mouseDragged = function() {
        mousePos.set(p.mouseX, p.mouseY)
    }

    p.mouseMoved = function () {  
        mousePos.set(p.mouseX, p.mouseY)
    }

    p.mousePressed = function() {
        for(var i = 0; i < topLashes.length; i++) {
            topLashes[i].overlap();
        }
    }

    p.mouseReleased = function() {
        for(var i = 0; i < topLashes.length; i++) {
            topLashes[i].unverlap();
        }
        hasLash = false;
    }

    p.unWind = function() {
        var moveThread = topLashes.length - looseThreads;
        for(var i = topLashes.length - 1; i > -1; i--) {
            if(i == moveThread) {

                console.log("here")
                topLashes[i].releaseThread();
            }
        }
    }

    p.Eye = class {
        constructor(_x, _y, _r){
            this.pos = p.createVector(_x, _y);
            this.dia = _r;
            this.iris = new p.Iris(_x, _y, _r)
        }

        draw() {
            p.noStroke();
            p.fill(211, 208, 203);
            p.ellipse(this.pos.x, this.pos.y, this.dia);
            this.iris.draw();
        }

        update() {
            this.iris.update();
        }
    }

    p.Iris = class {
        constructor(_x, _y, _r) {
            this.pos = p.createVector(_x, _y)
            this.startPos = p.createVector(_x, _y)
            this.tarPos = p.createVector(_x, _y)
            this.dia = _r/2
            this.pupil = new p.Pupil(_x, _y, this.dia)
            this.maxDist = _r/2 - this.dia/2
            this.moveRate = 0.01;
            this.resetMoveRate = .1;
        }

        draw() {
            p.fill(127, 91, 30)
            p.ellipse(this.pos.x, this.pos.y, this.dia);
            this.pupil.draw();
        }

        update() {
            if (mousePos.dist(this.startPos) < eyeWatchDist) {
                this.tarPos.set(mousePos);
                var newPosX = p.lerp(this.pos.x, this.tarPos.x, this.moveRate)
                var newPosY = p.lerp(this.pos.y, this.tarPos.y, this.moveRate)
                if (p.abs(newPosX - this.startPos.x) < this.maxDist) {
                    this.pos.x = newPosX
                }
                if (p.abs(newPosY - this.startPos.y) < this.maxDist) {
                    this.pos.y = newPosY
                }
            } else {
                this.tarPos.set(this.startPos);
                this.pos.lerp(this.startPos, this.resetMoveRate);
            }
            this.pupil.update(this.pos)
       
        }
    }

    p.Pupil = class {
        constructor(_x, _y, _r) {
            this.pos = p.createVector(_x, _y);
            this.dia = _r / 2;
            this.startDia = this.dia;
            this.minDia = _r * 0.1;
            this.maxDia = _r * 0.6;
            this.tarDia = this.dia;
        }

        draw() {
            p.fill(0)
            p.ellipse(this.pos.x, this.pos.y, this.dia);
        }

        update(_newPos) {
            this.pos.set(_newPos)
            var mouseDist = this.pos.dist(mousePos);
            this.tarDia = p.constrain(mouseDist, this.minDia, this.maxDia);
            this.dia = p.lerp(this.dia, this.tarDia, 0.5);
        }
    }

    p.Lash = class {
        constructor(_x, _y, _length, _i) {
            this.posOne = p.createVector(_x, _y);
            this.posTwo = p.createVector(_x, _y + _length);
            this.posOneStart = p.createVector(_x, _y);
            this.postTwoStart = p.createVector(_x, _y + _length);
            this.len = _length;
            this.weight = 3;
            this.hoverRed = 0;
            this.topButt = false;
            this.botButt = false;
            this.startPos = p.createVector(_x, _y);
            this.index = _i;
            this.topIndex = _i * 2;
            this.botIndex = this.topIndex + 1;
            this.topLoose = false;
            this.botLoose = false;
            if(this.index == 0) {
                this.topLoose = true;
            } 
        }

        draw() {
            if(!this.topLoose || !this.botLoose) {
                p.stroke(this.hoverRed, 0, 0)
                p.strokeWeight(this.weight)
                p.line(this.posOne.x, this.posOne.y,  this.posTwo.x,  this.posTwo.y)
                p.fill(255, 0, 0);
                if (this.topButt) {
                    this.held();
                    p.ellipse(this.posOne.x, this.posOne.y, 5);
                }
                if (this.botButt) {
                    this.held();
                    p.ellipse(this.posTwo.x, this.posTwo);
                }
            }
        }

        overlap() {
            if(mousePos.dist(this.posOne) < 5){
                if(this.topLoose) {
                    this.hoverRed = 255;
                    this.topButt = true;
                    hasLash = true;
                }
            } else if(mousePos.dist(this.posTwo) < 5) {
                if(this.botLoose) {
                    this.hoverRed = 255;
                    this.botButt = true;
                    hasLash = true;
                }
            } else {
                this.topButt = false;
                this.botButt = false;
                this.hoverRed = 0;
            }
        }

        unverlap() {
            this.topButt = false;
            this.botButt = false;
            this.hoverRed = 0;
        }

        held() {
            var newPos = p.createVector(p.mouseX, p.mouseY);
            if(this.topLoose && this.topButt) {
                newPos.x = p.lerp(this.posOne.x, p.mouseX, 0.1);
                newPos.y = p.lerp(this.posOne.y, p.mouseY, 0.1);
            } else if(this.botLoose && this.botButt) {
                newPos.x = p.mouseX;
                newPos.y = p.mouseY;
            }
            if(p.abs(this.posOneStart.x - newPos.x) < distCanMove) {
                this.posOne.x = newPos.x
            }
            if(p.abs(this.posOneStart.y - newPos.y) < distCanMove) {
                this.posOne.y = newPos.y
            }
        }

        releaseThread() {
            this.posOne.lerp(this.posTwo, 0.1)
            distCanMove += 1;
            if(this.posTwo.dist(this.posOne) < 0.5) {
                //console.log("reached")
                looseThreads++;
                this.botLoose = true;
                this.topLoose = true;
            }
        }

    }

}