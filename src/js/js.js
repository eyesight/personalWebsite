import OpenOnClick from './OpenOnClick';
import WeatherData from './WeatherData';
import ChangeTextAndColor from './ChangeTextAndColor';
import Rainanimation from "./Rainanimation";
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
      let weatherID = changeTextAndColorInstance.getWeatherId(data);
      let colorArray = colors.getColorsArray(data);
      console.log(weatherID);
      if (weatherID >= 50 && weatherID <= 59) {
        console.log('its raining');
      } else {
        // new Coloranimation(colorArray);
        new Rainanimation(colorArray);
        console.log('every thing else');
      }
    }).catch((err) => {
      changeTextAndColorInstance.doWeatherStuff(null);
      let colorArray = colors.getColorsArray(null);
      new Rainanimation(colorArray);
      //new Coloranimation(colorArray);

      console.log(err);
    });
  }
}

window.onload = () => {
  new App();
  new OpenOnClick();
}
