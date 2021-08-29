import OpenOnClick from './OpenOnClick';
import WeatherData from './WeatherData';
import ChangeTextAndColor from './ChangeTextAndColor';
import Coloranimation from "./Coloranimation";
import { id } from './../notwatched/id';

class App {
  constructor() {
    this.weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=";
    this.region = 'Zurich';
    this.params = `${this.weatherurl}${this.region}&appid=${id}`;

    let Weather = new WeatherData();
    let changeTextAndColorInstance = new ChangeTextAndColor();

    Weather.getData(this.params).then((data) => changeTextAndColorInstance.doWeatherStuff(data))
      .catch((err) => {
        console.log(err);
      });;
  }
}

window.onload = () => {
  new App();
  new OpenOnClick();
  new Coloranimation();
}
