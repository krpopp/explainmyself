let sketch = function (p) {

    var winWidth;
    var winHeight;

    var zits = [];
    var testZit;

    var player;

    var idleSprite;
    var pokeSprite;
    var rubSprite;

    var debug = true;

    var zitTrigger = 15;

    var zitMinTrigger = 30;
    var zitMaxTrigger = 35;

    var background;

    var zitSpriteW = [];
    var zitSpriteH = [];

    var smallZits = [];
    var medZits = [];

    p.preload = function () {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;

        idleSprite = p.loadImage('idle.png');
        pokeSprite = p.loadImage('poke.png');
        rubSprite = p.loadImage('rub.png');
        background = p.loadImage('baseskin.png');

        for (var i = 0; i < 4; i++) {
            smallZits.push(p.loadImage('zits/smallzit' + i + ".png"));
        }

        for (var i = 0; i < 10; i++) {
            medZits.push(p.loadImage('zits/medzit' + i + '.png'));
        }

    }

    p.setup = function () {
        p.createCanvas(winWidth, winHeight);
        p.rectMode(p.CENTER);
        p.noSmooth();
        for(var i = 0; i < 4; i++) {
            zitSpriteW.push(smallZits[i].width);
            zitSpriteH.push(smallZits[i].height);
        }

        player = new p.Hand(200, 200);
        p.makeNewZit(p.random(200, winWidth - 200), p.random(200, winHeight - 200), 1);
        for (let element of document.getElementsByClassName("p5Canvas")) {
            element.addEventListener("contextmenu", (e) => e.preventDefault());
        }
    }

    p.draw = function () {
        p.tint(242, 198, 165);
        p.image(background, 0, 0);
        p.tint(255);
        //p.background(250, 187, 182);
        //testZit.display();

        for(var i = 0; i < zits.length; i++) {
            zits[i].display();
            if(zits[i].oil > zitTrigger) {
                //if(p.zitChance(zits[i].x, zits[i].y, zits[i].r)) {
                   // zits[i].birthZit();
                //} 
            }
        }

        player.update();
        player.display();
    }

    p.mouseReleased = function () {
        player.sprite = idleSprite;
        if (player.state == 1 && player.zitOn != null) {
            player.doUnRub();
        } else if (player.state == 2 && player.zitOn != null) {
            player.doUnPoke();
        }
        player.state = 0;
    }

    p.makeNewZit = function (_x, _y, _r) {
        var newX = p.random();
        if(newX < 0.5) {
            newX = p.random(_x - (_r * 3), _x - _r);
        } else {
            newX = p.random(_x + _r, _x + (_r * 3));
        }
        var newY = p.random();
        if(newY < 0.5) {
            newY = p.random(_y - (_r * 3), _y - _r);
        } else {
            newY = p.random(_y + _r, _y + (_r * 3));
        }
        var newZit = new p.Zit(newX, newY)
        zits.push(newZit);
    }

    p.zitChance = function (_x, _y, _r) {
        var randChance = p.random(0, 100);
        if(randChance > zitMinTrigger && randChance < zitMaxTrigger) {
            p.makeNewZit(_x, _y, _r);
            return true;
        } else {
            return false;
        }
    }


    p.Zit = class {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;

            this.w = zitSpriteW[0]/4;
            this.h = zitSpriteH[0]/4;

            this.r = zitSpriteW[0]/4;

            this.oil = 10;
            this.strength = 20;
            this.jostleAmt = 0;
            this.deltaTouch = 0;
            this.lastSecond = 0;

            this.healedMin = 10;
            this.deJostleMin = 5;

            this.popping = false;
            this.popped = false;

            this.size = 1;

            this.startSecond = p.round((p.millis()/1000))

            this.currSprites = smallZits;
            this.sprite = smallZits[0];
            this.spriteInd = 0;

            this.animCount = 0;
            this.animRate = 3;
        }

        resizeSprite() {
            //this.sprite.resize(this.w, this.h);
        }

        newSprite(_newInd) {
            this.spriteInd = _newInd;
            this.sprite = this.currSprites[this.spriteInd];
            this.w = this.currSprites[this.spriteInd].width / 4;
            this.h = this.currSprites[this.spriteInd].height / 4;
            this.r = this.w
            //this.resizeSprite();
        }

        newSpriteSet(_size) {
            switch (_size) {
                case 2:
                    this.currSprites = medZits;
                    this.spriteInd = 0;
                    this.sprite = medZits[0];
                    this.w = zitSpriteW[this.spriteInd]/4;
                    this.h = zitSpriteH[this.spriteInd]/4;
                    this.r = this.w
                    break;
            }
        }

        display() {
            if(!this.popping && !this.popped) {
                //p.noStroke();
                //p.fill(184, 74, 98);
                //p.ellipse(this.x, this.y, this.r);
                this.resizeSprite();
                p.image(this.sprite , this.x-this.r/2, this.y - this.r/2, this.w, this.h);
                this.checkCol();
                this.incSinceTouch();
                if(this.deltaTouch > this.healedMin) {
                    this.strengthen();
                }
                if(this.deltaTouch > this.deJostleMin) {
                    this.dejostle();
                }
    
                if(debug) {
                    this.debugStats();
                }
            } else if (this.popping && !this.popped) {
                this.popAnim();
                p.image(this.sprite , this.x-this.r/2, this.y - this.r/2, this.w, this.h);
            } else {
                //p.noStroke();
                //p.fill(128, 99, 105);
                //p.ellipse(this.x, this.y, 5);
            }


        }

        debugStats() {
            p.textSize(12);
            p.textAlign(p.RIGHT);
            p.text("oil " + this.oil, this.x, this.y - 50)
            p.text("strength " + this.strength, this.x, this.y - 40);
            p.text("jostled " + this.jostleAmt, this.x, this.y - 30);
            p.text("since last " + this.deltaTouch, this.x, this.y - 20);
        }

        checkCol() {
            if(this.x - this.r < p.mouseX &&
                this.x + this.r > p.mouseX &&
                this.y - this.r < p.mouseY &&
                this.y + this.r > p.mouseY) {
                    player.zitOn = this;
                } 
        }

        touched() {
            this.startSecond = p.round((p.millis()/1000))
        }

        feed() {
            this.touched();
            this.oil += 1;
            this.jostleAmt += 1;
            this.rubUpdate();
        }

        poke() {
            //console.log("poke");
            if (this.spriteInd == 0) {
                this.newSprite(1);
            }
            this.jostleAmt += 1;
            this.pokeUpdate();
        }

        unPoke() {
            if (this.spriteInd == 1) {
                this.newSprite(0);
            }
        }

        weaken() {
            if(this.jostleAmt % 2) {
                this.strength -= 1;
            }
        }

        strengthen() {
            if(p.second() != this.lastSecond) {
                this.strength += 1;
                this.lastSecond = p.second();
            }
        }

        birthZit() {
            this.oil -= 5;
        }

        dejostle() {
            if(p.millis() % 2 == 0 && this.jostleAmt > 0) {
                this.jostleAmt-=1;
            }
        }

        incSinceTouch() {
            this.deltaTouch = p.round((p.millis()/1000)) - this.startSecond;
        }

        rubUpdate() {
            this.w += 0.5;
            this.h += 0.5;
            //this.resizeSprite();
            if(this.oil == 20) {
                this.newSpriteSet(2);
            }else if(this.oil == 30) {
                //this.newSprite(2);
            } else if(this.oil == 40) {
                //this.newSprite(3);
            } else if(this.oil == 50) {
                //this.newSprite(4);
            }
            this.r = this.w;
            this.weaken();
            if(this.strength < 0) {
                //this.pop();
            }
        }

        pokeUpdate() {
            this.weaken();
            if (this.jostleAmt > 25) {
                this.newSprite(2);
            }
            if (this.strength < 0) {
                this.pop();
            }
        }

        pop() {
            player.zitOn = null;
            this.popping = true;
            // this.popped = true;
            // if(player.zitOn == this) {
            //     player.zitOn = null;
            // }
        }

        popAnim() {
            this.animCount += 1;
            if (this.animCount > this.animRate && this.spriteInd <= this.currSprites.length) {
                var nI = this.spriteInd + 1;
                this.newSprite(nI);
                this.animCount = 0;
            } else if (this.spriteInd >= this.currSprites.length - 1) {
                this.popped = true;
            }
        }
    };

    p.Hand = class {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
            this.xLast = _x;
            this.yLast = _y;
            this.moveDist = 0;
            this.moveLim = 1;
            this.state = 0;

            this.zitOn = null;

            this.sprite = idleSprite;
        }

        display() {
            p.image(this.sprite, this.x - 190, this.y);
            p.fill(0);
            p.textSize(32);
            switch(this.state) {
                case 0:
                    //p.text("idle", this.x, this.y)
                    break;
                case 1:
                    //p.text("rub", this.x, this.y)
                    break;
                case 2:
                    //p.text("poke", this.x, this.y)
                    break;
            }
        }

        update() {
            this.x = p.mouseX;
            this.y = p.mouseY;
            if(p.mouseIsPressed) {
                this.changeState()
            } else {
                //this.sprite = idleSprite;
            }
            if (this.zitOn != null) {
                if (this.state == 1) {
                    this.checkMove();
                } else if (this.state == 2) {
                    this.doPoke();
                }
            }
        }

        changeState() {
            switch(p.mouseButton) {
                case p.LEFT:
                    this.sprite = rubSprite;
                    this.state = 1;
                    break;
                case p.RIGHT:
                    this.sprite = pokeSprite;
                    this.state = 2;
                    break;
            }
        }

        checkMove() {
            this.moveDist = p.dist(this.x, this.y, this.xLast, this.yLast);
            if(this.moveDist > this.moveLim) {
                this.zitOn.feed();
                this.xLast = this.x;
                this.yLast = this.y;
            }
        }

        doPoke() {
            this.zitOn.poke();
        }

        doUnRub() {
            this.zitOn = null;
        }

        doUnPoke() {
            this.zitOn.unPoke();
            this.zitOn = null;
        }
    }

}