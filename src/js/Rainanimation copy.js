import Helper from './Helper';
import * as PIXI from 'pixi.js';

class Rainanimation {
  constructor(colorArray) {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('canvas-background');
    this.canvasAnimation = document.createElement('canvas');
    this.canvasAnimation.classList.add('canvas-ani');
    this.image = document.createElement('img');
    this.image.classList.add('canvas__image');
    this.wrapper = document.querySelector('.wrapper-outer');
    this.textleft = document.querySelector('.text--left');
    this.textleftCoords = Helper.getCoords(this.textleft);
    this.textright = document.querySelector('.text--right');
    this.textrightCoords = Helper.getCoords(this.textright);
    this.body = document.querySelector('body');
    //this.body.appendChild(this.canvasAnimation);
    this.body.appendChild(this.image);
    this.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctxAnimation = this.canvasAnimation.getContext('2d');

    this.stageWidth = this.body.clientWidth;
    this.stageHeight = this.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;

    this.mediaQueryM = window.matchMedia("(max-width: 750px)");
    this.mediaQueryS = window.matchMedia("(max-width: 500px)");
    this.mediaQueryXS = window.matchMedia("(max-width: 400px)");
    this.fontSize = this.getFontsize().fontS;
    this.textBaseLine = this.getFontsize().textBaseLine;
    this.textPositionTop = this.getFontsize().textPositionTop;

    this.bgColors = (colorArray && colorArray.length > 0) ? colorArray : ["#353D40", "#D9D9D9", "#A1A5A6", "#F2B138", "#003F63"];
    this.bgCurrent = this.bgColors[0];
    this.canvas.style.backgroundColor = this.bgColors[0];
    this.bg = this.bgColors[1];

    this.mouseposition = {
      mouseX: 0,
      mouseY: 0
    }

    window.addEventListener('resize', this.resize.bind(this));
    //this.body.addEventListener("mousemove", this.ripple.bind(this), false);
    //this.wrapper.addEventListener("mousemove", this.ripple.bind(this), false);
    //this.body.addEventListener("click", this.ripple.bind(this), false);

    this.resize();
  }

  addImage() {
    const dataURI = this.canvas.toDataURL();
    this.image.src = dataURI;
  }

  resize() {
    this.stageWidth = this.body.clientWidth;
    this.stageHeight = this.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;

    this.canvasAnimation.width = this.stageWidth;
    this.canvasAnimation.height = this.stageHeight;

    this.fontSize = this.getFontsize().fontS;
    this.textBaseLine = this.getFontsize().textBaseLine;
    this.textPositionTop = this.getFontsize().textPositionTop;

    this.textleftCoords = Helper.getCoords(this.textleft);
    this.textrightCoords = Helper.getCoords(this.textright);
    document.fonts.load('bold 540px "Roboto"').then((data) => {
      this.buildBackground(this.bg, this.bgCurrent);
      this.addImage();
      this.initPixi();
    }).catch((err) => {
      this.buildBackground(this.bg, this.bgCurrent);
      this.addImage();
      console.log(err);
    });
  }

  getFontsize() {
    let fontS = '540px'
    let textBaseLine = 'middle';
    let textPositionTop = (this.canvas.height / 2) + 50;

    switch (true) {
      case this.mediaQueryXS.matches:
        fontS = '250px';
        textBaseLine = 'top';
        textPositionTop = 30;
        break;
      case this.mediaQueryS.matches:
        fontS = '300px';
        textBaseLine = 'top';
        textPositionTop = 10;
        break;
      case this.mediaQueryM.matches:
        fontS = '400px';
        textBaseLine = 'middle';
        textPositionTop = (this.canvas.height / 2) - 30;
        break;
      default:
        fontS = '540px';
        textBaseLine = 'middle';
        textPositionTop = (this.canvas.height / 2) + 50;
        break;
    }

    return {
      fontS,
      textBaseLine,
      textPositionTop
    }
  }

  buildBackground(fillColor, fillColor2) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //add Background
    this.buildRectangle(0, 0, this.canvas.width, this.canvas.height, fillColor2);

    //add font
    this.ctx.font = `bold ${this.fontSize} Roboto, sans-serif`;
    this.ctx.fillStyle = fillColor;
    this.ctx.textBaseline = this.textBaseLine;
    this.ctx.textAlign = "center";
    this.ctx.fillText("CF", (this.canvas.width / 2) - 10, this.textPositionTop);

    //add rectangle
    this.buildRectangle(this.textleftCoords.x, this.textleftCoords.y, this.textleftCoords.width, this.textleftCoords.height, fillColor2);
    this.buildRectangle(this.textrightCoords.x, this.textrightCoords.y, this.textrightCoords.width, this.textrightCoords.height, fillColor2);

    this.ctx.restore();
  }

  buildRectangle(x, y, width, height, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  initPixi() {
    debugger;
    const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
    document.body.appendChild(app.view);
    let image = new PIXI.Sprite.from(this.image.src);
    image.width = window.innerWidth;
    image.height = window.innerHeight;
    app.stage.addChild(image);
    this.displacementSprite = new PIXI.Sprite.from("cloud.jpg");
    let displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    app.stage.addChild(this.displacementSprite);
    app.stage.filters = [displacementFilter];
    app.renderer.view.style.transform = 'scale(1.02)';
    this.displacementSprite.scale.x = 4;
    this.displacementSprite.scale.y = 4;
    this.animate();
  }

  animate() {
    console.log(this.displacementSprite.x);
    this.displacementSprite.x += 10;
    this.displacementSprite.y += 4;
    requestAnimationFrame(this.animate());
  }
}

export default Rainanimation;