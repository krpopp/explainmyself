let sketch = function (p) {

    var winWidth;
    var winHeight;

    var debug = false;

    var eye;

    var mousePos

    var eyeWatchDist = 300;

    var topLashes = [];

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
       
    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        eye = new p.Eye(winWidth / 2, winHeight / 2, 80);
        mousePos = p.createVector(winWidth / 2, winWidth / 2);
        for (var i = 0; i < 16; i++) {
            topLashes[i] = new p.Lash((eye.pos.x - eye.dia) + (i * 10), eye.pos.y - eye.dia, 20)
        }
    }

    p.draw = function () {
        p.background(154, 122, 160);
        eye.draw();
        eye.update();

        for (var i = 0; i < topLashes.length; i++) {
            topLashes[i].overlap();
            topLashes[i].draw();
        }
    }

    p.mouseDragged = function() {
    }

    p.mouseMoved = function () {
        
        mousePos.set(p.mouseX, p.mouseY)
    }

    p.mousePressed = function() {
    }

    p.mouseReleased = function() {
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
        constructor(_x, _y, _length) {
            this.pos = p.createVector(_x, _y);
            this.len = _length;
            this.weight = 3;
            this.hoverRed = 0;
            this.topButt = false;
            this.botButt = false;
            this.startPos = p.createVector(_x, _y);
        }

        draw() {
            p.stroke(this.hoverRed, 0, 0)
            p.strokeWeight(this.weight)
            p.line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.len)
            p.fill(255, 0, 0);
            if (this.topButt) {
                console.log("TOP")
                p.ellipse(this.pos.x, this.pos.y, 5);
            }
            if (this.botButt) {
                p.ellipse(this.pos.x, this.pos.y + this.len, 5);
            }
        }

        overlap() {
            if (p.mouseX > this.pos.x - this.weight && p.mouseX < this.pos.x + this.weight && p.mouseY > this.pos.y && p.mouseY < this.pos.y + this.len) {
                this.hoverRed = 255;
                this.sideCheck();
            } else {
                this.topButt = false;
                this.botButt = false;
                this.hoverRed = 0;
            }
        }

        sideCheck() {
            if (p.mouseY < this.pos.y + (this.len / 2)) {
                console.log("hi")
                this.topButt = true;
            } else {
                this.topButt = false;
            }
            if (p.mouseY > this.pos.y + (this.len / 2)) {
                this.botButt = true;
            } else {
                this.botButt = false;
            }
        }

    }

}