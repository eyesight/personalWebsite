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
    this.body.appendChild(this.canvasAnimation);
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
    this.body.addEventListener("click", this.onClick.bind(this), false);

    this.resize();

    let FPS = 30;
    setInterval(() => { this.update(); }, 1000 / FPS);
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

    this.resultPixels = new Array();
    this.sourcePixels = new Array();
    this.resultPixels.length = this.canvasAnimation.width * this.canvasAnimation.height;
    this.sourcePixels.length = this.canvasAnimation.width * this.canvasAnimation.height;
    for (let n = 0; n < this.canvasAnimation.width * this.canvasAnimation.height; n++) {
      this.resultPixels[n] = 0;
      this.sourcePixels[n] = 0;
    }

    document.fonts.load('bold 540px "Roboto"').then((data) => {
      this.buildBackground(this.bg, this.bgCurrent);
      this.addImage();
    }).catch((err) => {
      this.buildBackground(this.bg, this.bgCurrent);
      this.addImage();
      console.log(err);
    });
  }

  onClick(e) {
    let x = e.offsetX; //e.pageX - 8;
    let y = e.offsetY; //e.pageY - 8;
    console.log('test');
    this.sourcePixels[y * this.canvasAnimation.width + x] = 1000;
  }

  update() {
    let imageData = this.ctxAnimation.getImageData(0, 0, this.canvasAnimation.width, this.canvasAnimation.height);
    let pixels = imageData.data;

    let totalpixels, totalvalue, newvalue;

    for (let x = 1; x < this.canvasAnimation.width - 1; x++)
      for (let y = 1; y < this.canvasAnimation.height - 1; y++) {
        totalvalue = 0;
        totalpixels = 4.0;

        totalvalue += this.sourcePixels[(y - 1) * this.canvasAnimation.width + (x)];
        totalvalue += this.sourcePixels[(y + 1) * this.canvasAnimation.width + (x)];
        totalvalue += this.sourcePixels[y * this.canvasAnimation.width + (x - 1)];
        totalvalue += this.sourcePixels[y * this.canvasAnimation.width + (x + 1)];

        totalvalue += this.sourcePixels[(y - 1) * this.canvasAnimation.width + (x - 1)];
        totalvalue += this.sourcePixels[(y - 1) * this.canvasAnimation.width + (x + 1)];
        totalvalue += this.sourcePixels[(y + 1) * this.canvasAnimation.width + (x - 1)];
        totalvalue += this.sourcePixels[(y + 1) * this.canvasAnimation.width + (x + 1)];

        //totalvalue += sourcemappixels[( (y-1) * width + (x-1)) * 4];
        //totalvalue += (sourcemappixels[( (y-1) * width + (x)) * 4] - 0);
        //totalvalue += sourcemappixels[( (y-1) * width + (x+1)) * 4];
        //totalvalue += (sourcemappixels[( y * width + (x-1)) * 4] - 0);
        //totalvalue += (sourcemappixels[( y * width + (x+1)) * 4] - 0);
        //totalvalue += sourcemappixels[( (y+1) * width + (x-1)) * 4];
        //totalvalue += (sourcemappixels[( (y+1) * width + (x)) * 4] - 0);
        //totalvalue += sourcemappixels[( (y+1) * width + (x+1)) * 4];

        totalvalue /= totalpixels;
        newvalue = totalvalue - this.resultPixels[y * this.canvasAnimation.width + x];
        newvalue = newvalue - newvalue / 64.0;    //some damping it seems
        this.resultPixels[y * this.canvasAnimation.width + x] = newvalue;
      }

    for (let n = 0; n < this.canvasAnimation.width * this.canvasAnimation.height; n++) {
      pixels[n * 4] = this.resultPixels[n] + 128;
      pixels[n * 4 + 1] = this.resultPixels[n] + 128;
      pixels[n * 4 + 2] = this.resultPixels[n] + 128;
      pixels[n * 4 + 3] = 255;

      var temp = this.sourcePixels[n];
      this.sourcePixels[n] = this.resultPixels[n];
      this.resultPixels[n] = temp;
    }

    this.ctxAnimation.putImageData(imageData, 0, 0);
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
}

export default Rainanimation;