import { id } from './../notwatched/id';

class WeatherData {
  constructor() {
    this.weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=";
    this.region = 'Zurich';
    this.params = `${this.weatherurl}${this.region}&appid=${id}`;

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
    let weatherid = 100 - Math.round(weather.weather[0].id / 10); //green: weather-code
    let wind = weather.wind.deg ? Math.round((0.28 * weather.wind.deg) * 2.55) : 90; //blue: winddirection

    let temp2 = Math.round(weather.main.temp - 273.15 + windspeed); //temperature
    let weatherid2 = Math.round(weather.weather[0].id / 10 + windspeed); //green: weather-code
    let wind2 = weather.wind.deg ? Math.round((0.28 * weather.wind.deg) * 2.55 + windspeed) : 90 * 2; //blue: winddirection

    let colorBackground = 'rgb(' + weatherid + ', ' + temp + ', ' + wind + ')';
    let colorFont = 'rgb(' + temp2 + ', ' + wind2 + ', ' + weatherid2 + ')';

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
}

export default WeatherData;