import Helper from './Helper';
import { id } from './../notwatched/id';

class App {
  constructor() {
    this.allBtns = Array.prototype.slice.call(document.querySelectorAll('.anchor--inline'));
    this.id = id;
    this.weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=";

    this.clickLeftRight(this.allBtns);
    this.clickOutSide(this.allBtns);
    this.followCursor();
    this.weatherStuff(this.id, this.weatherurl);
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

  clickOutSide(elements,) {
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

  weatherStuff(id, weatherurl) {
    const region = 'Zurich';
    let url = weatherurl + region + '&appid=' + id;
    let weather = JSON.parse(this.Get(url));
    let problem = false;

    console.log(id);

    if (!weather || !url || weather.cod == 404 || weather.cod == 401) {
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
    let windspeed2 = weather.wind.speed / 10;

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
    console.log(weather.weather[0].id / 10);
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

    console.log('temp: ' + temp);
    console.log('weather ID: ' + weatherid);
    console.log('wind: ' + wind);
    console.log('windspeed: ' + weather.wind.speed);
    console.log('windspeed: ' + windspeed2);
    console.log(weather);
  }

  Get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
  }
}

window.onload = () => {
  new App();
}
