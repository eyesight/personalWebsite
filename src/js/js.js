import OpenOnClick from './OpenOnClick';
import WeatherData from './WeatherData';
import ChangeTextAndColor from './ChangeTextAndColor';
import Coloranimation from "./Coloranimation";
import MakeColors from "./MakeColors";
import { id } from './../notwatched/id';

class App {
  constructor() {
    this.weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=";
    this.region = 'Zurich';
    this.params = `${this.weatherurl}${this.region}&appid=${id}`;

    let Weather = new WeatherData();
    let changeTextAndColorInstance = new ChangeTextAndColor();
    let colors = new MakeColors;

    Weather.getData(this.params).then((data) => {
      changeTextAndColorInstance.doWeatherStuff(data);
      let colorArray = colors.getColorsArray(data);
      new Coloranimation(colorArray);
    }).catch((err) => {
      console.log(err);
    });
  }
}

window.onload = () => {
  new App();
  new OpenOnClick();
}
