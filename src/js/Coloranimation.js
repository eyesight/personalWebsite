class Coloranimation {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.circleRadius = 30;
    this.bgColors = ["#353D40", "#D9D9D9", "#A1A5A6", "#F2B138", "#003F63"];
    this.colorObject = {};
    this.bg = this.bgColors[0];
    this.colorIndex = 0;
    this.canvas.style.backgroundColor = this.bgColors[this.bgColors.length - 1];
    this.zoomAniSpeed = 50;

    this.ballX = 0;
    this.ballY = 0;
    this.mouseposition = {
      mouseX: 0,
      mouseY: 0
    }

    window.addEventListener('resize', this.resize.bind(this));
    this.canvas.addEventListener("mousemove", this.setMousePosition.bind(this), false);
    this.canvas.addEventListener("mouseout", this.mouseLeave.bind(this), false);
    this.canvas.addEventListener("mouseenter", this.mouseEnter.bind(this), false);
    this.canvas.addEventListener("click", this.handleClickEvent.bind(this), false)
    this.moveBall();
    this.resize();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
  }

  setMousePosition(e) {
    let canvasPos = this.getPosition(this.canvas);
    this.mouseposition.mouseX = e.clientX - canvasPos.x;
    this.mouseposition.mouseY = e.clientY - canvasPos.y;
  }

  mouseLeave() {
    this.bg = 'transparent';
  }

  mouseEnter() {
    this.bg = this.bgColors[0];
    if (this.colorObject.next) {
      this.bg = this.colorObject.next;
    }
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
    this.zoom2 = this.zoom;
    this.colorObject = this.colorChanger(this.bgColors);
    this.counter = 150;
    this.zoomBall(this.colorObject);
    this.zoomBall2(this.colorObject);
  }

  moveBall() {
    this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg);
    requestAnimationFrame(this.moveBall.bind(this));
  }

  zoomBall(colorObject) {
    if (this.zoom < this.canvas.width) {
      this.bg = colorObject.current;
      this.zoom += this.zoomAniSpeed;
      this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.zoom, 0, 2 * Math.PI, this.bg);
      requestAnimationFrame(this.zoomBall.bind(this, colorObject));
    } else {
      this.changeCanvasStyle(this.colorObject);
    }
  }

  zoomBall2(colorObject) {
    if (this.zoom2 < (this.canvas.height / 4)) {
      this.zoom2 += (this.zoomAniSpeed / 5);
      this.counter -= 10;
      this.bg = `rgba(${this.hexToRgb(colorObject.old)},${this.counter / 100})`;
      this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.zoom2, 0, 2 * Math.PI, this.bg, true);
      requestAnimationFrame(this.zoomBall2.bind(this, colorObject));
    }
  }

  changeCanvasStyle(colorObject) {
    this.bg = colorObject.next;
    this.canvas.style.backgroundColor = colorObject.current;
    this.buildBall(this.mouseposition.mouseX, this.mouseposition.mouseY, this.circleRadius, 0, 2 * Math.PI, this.bg);
  }

  buildBall(posY, posX, size, size2, radius, fillColor, buildSecond = false) {
    if (!buildSecond) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.beginPath();
    this.ctx.arc(posY, posX, size, size2, radius, true);
    this.ctx.fillStyle = fillColor;
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

  hexToRgb(hex) {
    let color = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16)).join();
    return color;
  }
}

export default Coloranimation;