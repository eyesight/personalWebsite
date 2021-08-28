import Helper from './Helper';
import { id } from './../notwatched/id';

class App {
  constructor() {
    this.allBtns = Array.prototype.slice.call(document.querySelectorAll('.anchor--inline'));
    this.weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=";
    this.region = 'Zurich';
    this.params = `${this.weatherurl}${this.region}&appid=${id}`;
    this.colorArray = [];

    this.clickLeftRight(this.allBtns);
    this.clickOutSide(this.allBtns);
    this.followCursor();
    this.getData(this.params).then(data => { this.doWeatherStuff(data) })
      .catch((err) => {
        console.log(err);
      });;
  }

  async getData(params) {
    let response = await fetch(params);
    if (response.status == 200) {
      return await response.json();
    }
    throw new Error(response.status);
  }

  clickLeftRight(elements) {
    elements.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (item.parentNode.parentNode.nextElementSibling) {
          if (item.parentNode.parentNode.nextElementSibling.classList.contains('active-animated')) {
            e.target.innerHTML = 'See here';
            Helper.removeClass(item.parentNode.parentNode.nextElementSibling, 'active-animated');
            setTimeout(function () { Helper.removeClass(item.parentNode.parentNode.nextElementSibling, 'active') }, 500);
          } else {
            e.target.innerHTML = 'Close here';
            Helper.addClass(item.parentNode.parentNode.nextElementSibling, 'active');
            setTimeout(function () { Helper.addClass(item.parentNode.parentNode.nextElementSibling, 'active-animated') }, 500);
          }
        } else {
          if (item.parentNode.parentNode.previousElementSibling.classList.contains('active-animated')) {
            e.target.innerHTML = 'See here';
            Helper.removeClass(item.parentNode.parentNode.previousElementSibling, 'active-animated');
            setTimeout(function () { Helper.removeClass(item.parentNode.parentNode.previousElementSibling, 'active') }, 500);
          } else {
            e.target.innerHTML = 'Close here';
            Helper.addClass(item.parentNode.parentNode.previousElementSibling, 'active');
            setTimeout(function () { Helper.addClass(item.parentNode.parentNode.previousElementSibling, 'active-animated') }, 500);
          }
        }
      })
    });
  }

  clickOutSide(elements) {
    window.addEventListener("click", (e) => {
      if (!e.target.classList.contains('anchor--inline')) {
        elements.forEach((itemnew) => {
          Helper.removeClass(itemnew.parentNode.parentNode, 'active-animated');
          setTimeout(() => { Helper.removeClass(itemnew.parentNode.parentNode, 'active') }, 500);
          itemnew.innerHTML = 'See here';
        });
      }
    });
  }

  followCursor() {
    let cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
      let x = e.clientX;
      let y = e.clientY;
      cursor.style.left = x - 10 + 'px';
      cursor.style.top = y - 10 + 'px';
    });

    document.querySelectorAll('.anchor').forEach((item) => {
      item.addEventListener('mouseenter', (e) => {
        Helper.addClass(cursor, 'over');
      });
      item.addEventListener('mouseleave', (e) => {
        Helper.removeClass(cursor, 'over');
      });
    });
  }

  doWeatherStuff(weather) {
    let problem = false;

    if (!weather || weather.cod == 404 || weather.cod == 401) {
      problem = true;
      weather = {
        wind: {
          speed: 4.5,
          deg: 90
        },
        main: {
          temp: 270
        },
        weather: {
          0: {
            id: 800,
            description: 'no weather data reachable'
          }
        },
      };
    }

    let windspeed = 0;
    if (weather.wind.speed > 6) {
      windspeed = Math.round(weather.wind.speed);
    } else {
      windspeed = Math.round(weather.wind.speed * 10);
    }

    let temp = Math.round(weather.main.temp - 273.15); //temperature

    let colorHsl = this.colorTemperatureToHSL(temp);
    let colorHex = this.hsl2hex(colorHsl.h, colorHsl.s, colorHsl.l);
    let colorHex2 = this.hsl2hex(colorHsl.h + 50, colorHsl.s + 20, colorHsl.l - 20);
    let colorHex3 = this.hsl2hex(colorHsl.h + 100, colorHsl.s, colorHsl.l - 10);
    this.colorArray.push(colorHex, colorHex2, colorHex3, this.invertColorHex(colorHex));
    let colorBackground = this.colorArray[0];
    let colorFont = this.colorArray[2];
    console.log(temp);
    console.log(colorHsl);
    console.log(this.invertColorHex(colorHex));
    console.log(this.colorArray);

    let allTextBlocks = Array.prototype.slice.call(document.querySelectorAll('.text'));
    allTextBlocks.forEach((item) => {
      item.style.backgroundColor = colorBackground;
    });

    let weathertext = problem ? weather.weather[0].description : weather.weather[0].description + ', temprature: ' + temp + '°C, winddirection: ' + weather.wind.deg + '°, wind speed: ' + weather.wind.speed + ' m/s';

    document.querySelector('body').style.backgroundColor = colorBackground;
    document.querySelector('.initials').style.color = colorFont;
    document.querySelector('.cursor').style.backgroundColor = colorFont;
    document.querySelector('.info').innerHTML = weathertext;
    document.querySelector('.color').innerHTML = colorBackground;
    let x = Math.round(weather.weather[0].id / 10);
    if (x >= 20 && x <= 29) {
      document.querySelector('body').classList.add('thunderstorm');
    } else if (x >= 30 && x <= 39) {
      document.querySelector('body').classList.add('fog');
    } else if (x >= 50 && x <= 59) {
      document.querySelector('body').classList.add('rain');
    } else if (x >= 60 && x <= 69) {
      document.querySelector('body').classList.add('snow');
    } else if (x >= 70 && x <= 79) {
      document.querySelector('body').classList.add('fog');
    } else if (x >= 80 && x <= 89) {
      document.querySelector('body').classList.add('clouds');
    } else {
      document.querySelector('body').classList.add('default');
    }
  }

  invertColorHex(col) {
    const colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    let inverseColor = '#'
    col.replace('#', '').split('').forEach(i => {
      const index = colors.indexOf(i)
      inverseColor += colors.reverse()[index]
    })
    return inverseColor
  }

  hsl2hex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  HSLToRGB(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
      r,
      g,
      b
    };
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
        console.log(hue);
        break;
      case (temp < 20 && temp >= 10):
        hue = (((temp - 10) * 10) + 90);
        saturation = 35;
        lightnes = 40;
        console.log(hue);
        break;
      case (temp < 10 && temp >= 0):
        hue = (((10 - temp) * 3) + 180);
        saturation = 70;
        lightnes = 30;
        console.log(hue);
        break;
      case (temp < 0):
        hue = ((temp * -1) + 220);
        saturation = 100;
        lightnes = 40;
        console.log(hue);
        break;
      default:
        hue = 180;
        saturation = 70;
        lightnes = 30;
        console.log(hue);
        break;
    }

    return {
      h: hue,
      s: saturation,
      l: lightnes
    }
  }
}

window.onload = () => {
  new App();
}
