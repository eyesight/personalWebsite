import Helper from './Helper';

class Coloranimation {
  constructor(colorArray) {
    this.canvas = document.createElement('canvas');
    this.wrapper = document.querySelector('.wrapper-outer');
    this.textleft = document.querySelector('.text--left');
    this.textleftCoords = Helper.getCoords(this.textleft);
    this.textright = document.querySelector('.text--right');
    this.textrightCoords = Helper.getCoords(this.textright);
    this.body = document.querySelector('body');
    this.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.anchors = [...document.querySelectorAll('.anchor')];

    this.mediaQueryM = window.matchMedia("(max-width: 750px)");
    this.mediaQueryS = window.matchMedia("(max-width: 500px)");
    this.mediaQueryXS = window.matchMedia("(max-width: 400px)");
    this.fontSize = this.getFontsize().fontS;
    this.textBaseLine = this.getFontsize().textBaseLine;
    this.textPositionTop = this.getFontsize().textPositionTop;

    this.circleRadius = this.getFontsize().circleRadius;
    this.circleRadiusHover = this.getFontsize().circleRadiusHover;
    this.zoom = this.circleRadius;
    this.bgColors = (colorArray && colorArray.length > 0) ? colorArray : ["#353D40", "#D9D9D9", "#A1A5A6", "#F2B138", "#003F63"];
    this.colorObject = {};
    this.bgCurrent = this.bgColors[0];
    this.colorIndex = 0;
    this.canvas.style.backgroundColor = this.bgColors[0];
    this.colorObject = this.colorChanger(this.bgColors);
    this.bg = this.bgColors[1];
    this.bg2Ball = this.bgColors[1];
    this.zoomAniSpeed = this.getFontsize().zoomAniSpeed;
    this.counter = 0; //counter for click animation

    //ball2 variables
    this.ball2Size = 150;
    this.ball2X = 0;
    this.ball2Y = 0;

    this.mouseposition = {
      mouseX: 0,
      mouseY: 0
    }

    window.addEventListener('resize', this.resize.bind(this));
    this.body.addEventListener("mousemove", this.setMousePosition.bind(this), false);
    this.wrapper.addEventListener("mousemove", this.setMousePosition.bind(this), false);
    this.body.addEventListener("click", this.handleClickEvent.bind(this), false);

    this.anchors.forEach((el) => {
      el.addEventListener("mouseover", this.zoomBallOnHover.bind(this, true), false);
      el.addEventListener("mouseout", this.zoomBallOnHover.bind(this, false), false);
    });

    this.moveBall();
    this.resize();
  }

  resize() {
    this.stageWidth = this.body.clientWidth;
    this.stageHeight = this.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;

    this.fontSize = this.getFontsize().fontS;
    this.textBaseLine = this.getFontsize().textBaseLine;
    this.textPositionTop = this.getFontsize().textPositionTop;
    this.circleRadius = this.getFontsize().circleRadius;
    this.circleRadiusHover = this.getFontsize().circleRadiusHover;
    this.zoomAniSpeed = this.getFontsize().zoomAniSpeed;

    this.textleftCoords = Helper.getCoords(this.textleft);
    this.textrightCoords = Helper.getCoords(this.textright);
    this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg, this.bgCurrent);
  }

  getFontsize() {
    let fontS = '540px'
    let textBaseLine = 'middle';
    let textPositionTop = (this.canvas.height / 2) + 50;
    let circleRadius = 30;
    let circleRadiusHover = 50;
    let zoomAniSpeed = 50;

    switch (true) {
      case this.mediaQueryXS.matches:
        fontS = '250px';
        textBaseLine = 'top';
        textPositionTop = 30;
        circleRadius = 0;
        circleRadiusHover = 0;
        zoomAniSpeed = 20;
        break;
      case this.mediaQueryS.matches:
        fontS = '300px';
        textBaseLine = 'top';
        textPositionTop = 10;
        circleRadius = 0;
        circleRadiusHover = 0;
        zoomAniSpeed = 20;
        break;
      case this.mediaQueryM.matches:
        fontS = '400px';
        textBaseLine = 'middle';
        textPositionTop = (this.canvas.height / 2) - 30;
        circleRadius = 0;
        circleRadiusHover = 0;
        zoomAniSpeed = 30;
        break;
      default:
        fontS = '540px';
        textBaseLine = 'middle';
        textPositionTop = (this.canvas.height / 2) + 50;
        circleRadius = 30;
        circleRadiusHover = 50;
        zoomAniSpeed = 50;
        break;
    }

    return {
      fontS,
      textBaseLine,
      textPositionTop,
      circleRadius,
      circleRadiusHover,
      zoomAniSpeed
    }
  }

  setMousePosition(e) {
    let canvasPos = this.getPosition(this.canvas);
    this.mouseposition.mouseX = e.clientX - canvasPos.x;
    this.mouseposition.mouseY = e.clientY - canvasPos.y;
  }

  getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;

    while (el) {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return {
      x: xPosition,
      y: yPosition
    };
  }

  handleClickEvent() {
    this.zoom = this.circleRadius;
    this.counter = 15;
    this.colorObject = this.colorChanger(this.bgColors);

    //change the variables for ball 2
    this.zoom2 = this.zoom;
    this.ball2X = this.mouseposition.mouseX;
    this.ball2Y = this.mouseposition.mouseY;

    this.zoomBall(this.colorObject);
  }

  moveBall() {
    this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg, this.bgCurrent);
    requestAnimationFrame(this.moveBall.bind(this));
  }

  zoomBall(colorObject) {
    if (this.zoom < this.canvas.width) {
      this.bg = colorObject.current;
      this.zoom += this.zoomAniSpeed;
      if (this.zoom2 < this.ball2Size) {
        this.zoom2 += (this.zoomAniSpeed / 10);
        this.counter -= 1;
        this.bg2Ball = `rgba(${Helper.hexToRgb(this.colorObject.old)},${this.counter / 10})`;
      }

      this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.zoom, 0, 2 * Math.PI, this.bg, this.bgCurrent, true);
      requestAnimationFrame(this.zoomBall.bind(this, colorObject));
    } else {
      this.changeCanvasStyle(this.colorObject);
    }
  }

  zoomBallOnHover(isOverElement) {
    if (this.circleRadius < this.circleRadiusHover && isOverElement) {
      this.circleRadius += 2;
      this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg, this.bgCurrent, false);
      requestAnimationFrame(this.zoomBallOnHover.bind(this, true));
    } else if (this.circleRadius > this.getFontsize().circleRadius && !isOverElement) {
      this.circleRadius -= 2;
      this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg, this.bgCurrent, false);
      requestAnimationFrame(this.zoomBallOnHover.bind(this, false));
    }
  }

  changeCanvasStyle(colorObject) {
    this.bg = colorObject.next;
    this.bgCurrent = colorObject.current;
    this.canvas.style.backgroundColor = this.bgCurrent;
    this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg, this.bgCurrent);
  }

  buildBall(posY, posX, size, size2, radius, fillColor, fillColor2, buildSecond = false) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //add font
    this.ctx.font = `bold ${this.fontSize} Roboto, sans-serif`;
    this.ctx.fillStyle = fillColor;
    this.ctx.textBaseline = this.textBaseLine;
    this.ctx.textAlign = "center";
    this.ctx.fillText("CF", (this.canvas.width / 2) - 10, this.textPositionTop);

    //add rectangle
    this.buildRectangle(this.textleftCoords.x, this.textleftCoords.y, this.textleftCoords.width, this.textleftCoords.height, fillColor2);
    this.buildRectangle(this.textrightCoords.x, this.textrightCoords.y, this.textrightCoords.width, this.textrightCoords.height, fillColor2);

    //add Ball
    this.buildCircle(posY, posX, size, size2, radius, fillColor);

    //add second ball
    if (buildSecond) {
      this.buildCircle(posY, posX, this.zoom2, size, size2, this.bg2Ball);
    }

    this.ctx.restore();
  }

  buildCircle(posY, posX, size, size2, radius, fillColor) {
    this.ctx.beginPath();
    this.ctx.arc(posY, posX, size, size2, radius, true);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
  }

  buildRectangle(x, y, width, height, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  colorChanger(colorArray) {
    let indexCurrent = this.colorIndex;
    let indexOld = (this.colorIndex - 1) < 0 ? colorArray.length - 1 : this.colorIndex - 1;
    this.colorIndex = this.colorIndex++ < colorArray.length - 1 ? this.colorIndex : 0;
    let indexNext = this.colorIndex;
    let colorPicked = {
      old: this.bgColors[indexOld],
      current: this.bgColors[indexCurrent],
      next: this.bgColors[indexNext]
    }
    return colorPicked;
  }
}

export default Coloranimation;