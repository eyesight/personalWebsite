import MakeColors from './MakeColors';
import Coloranimation from './Coloranimation';

class ChangeTextAndColor {
  constructor() {
    this.body = document.querySelector('body');
    this.info = document.querySelector('.info');
    this.color = document.querySelector('.color');
    this.colorObject = new MakeColors();
    this.colorObj = new Coloranimation();
    this.colorArray = [];
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

    let windspeed;
    if (weather.wind.speed > 6) {
      windspeed = Math.round(weather.wind.speed);
    } else {
      windspeed = Math.round(weather.wind.speed * 10);
    }

    let temp = Math.round(weather.main.temp - 273.15); //temperature
    this.colorArray = this.colorObject.getColorsArray(weather);
    let colorBackground = this.colorArray[0];

    //change text in info-elements
    let weathertext = problem ? weather.weather[0].description : weather.weather[0].description + ', temperature: ' + temp + '°C, winddirection: ' + weather.wind.deg + '°, wind speed: ' + weather.wind.speed + ' m/s';
    this.info.innerHTML = weathertext;
    this.color.innerHTML = colorBackground;

    //add class depending on weather-Status for the cursor
    let weatherID = Math.round(weather.weather[0].id / 10);
    switch (true) {
      case (weatherID >= 20 && weatherID <= 29):
        this.body.classList.add('thunderstorm');
        break;
      case (weatherID >= 30 && weatherID <= 39):
        this.body.classList.add('fog');
        break;
      case (weatherID >= 50 && weatherID <= 59):
        this.body.classList.add('rain');
        break;
      case (weatherID >= 60 && weatherID <= 69):
        this.body.classList.add('snow');
        break;
      case (weatherID >= 70 && weatherID <= 79):
        this.body.classList.add('fog');
        break;
      case (weatherID >= 80 && weatherID <= 89):
        this.body.classList.add('clouds');
        break;
      default:
        this.body.classList.add('default');
        break;
    }
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

export default ChangeTextAndColor;