import Helper from './Helper';

class MakeColors {
  constructor() {
    this.colorArray = [];
  }

  getColorsArray(weather) {
    let temp = weather && weather.main.temp ? Math.round(weather.main.temp - 273.15) : 0; //temperature in Celsius, when no data add 0 as temperature

    let colorHsl = this.colorTemperatureToHSL(temp);
    let colorHex = Helper.hsl2hex(colorHsl.h, colorHsl.s, colorHsl.l);
    let colorHex2 = Helper.hsl2hex(colorHsl.h + 50, colorHsl.s + 20, colorHsl.l - 20);
    let colorHex3 = Helper.hsl2hex(colorHsl.h + 100, colorHsl.s, colorHsl.l - 10);

    this.colorArray.push(colorHex, colorHex2, colorHex3, Helper.invertColorHex(colorHex));
    return this.colorArray;
  }

  colorTemperatureToHSL(celsius) {
    let temp = Math.round(celsius);
    let hue = temp;
    let saturation = 50;
    let lightnes = 50;

    switch (true) {
      case (temp < 40 && temp >= 20):
        hue = temp + 300;
        saturation = 80;
        lightnes = 30;
        break;
      case (temp < 20 && temp >= 10):
        hue = (((temp - 10) * 10) + 90);
        saturation = 35;
        lightnes = 40;
        break;
      case (temp < 10 && temp >= 0):
        hue = (((10 - temp) * 3) + 180);
        saturation = 70;
        lightnes = 30;
        break;
      case (temp < 0):
        hue = ((temp * -1) + 220);
        saturation = 100;
        lightnes = 40;
        break;
      default:
        hue = 180;
        saturation = 70;
        lightnes = 30;
        break;
    }

    return {
      h: hue,
      s: saturation,
      l: lightnes
    }
  }
}

export default MakeColors;