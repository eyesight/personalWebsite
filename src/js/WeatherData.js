class WeatherData {
  async getData(params) {
    let response = await fetch(params);
    if (response.status == 200) {
      return await response.json();
    }
    throw new Error(response.status);
  }
}

export default WeatherData;