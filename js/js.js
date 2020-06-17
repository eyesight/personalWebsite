document.addEventListener("DOMContentLoaded", function(){
  const allBtns =  Array.prototype.slice.call(document.querySelectorAll('.anchor--inline'));
  const region = 'Zurich';
  let url = "https://api.openweathermap.org/data/2.5/weather?q="+region+id;

  function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
  }

  if(!url){
    url = "https://api.openweathermap.org/data/2.5/weather?q=Zurich" + id;
  }
    let weather = JSON.parse(Get(url));
  // when the url for openweather doesn't know the region render data of zurich 
  if(!url || weather.cod == 404){
    url = "https://api.openweathermap.org/data/2.5/weather?q=Zurich" + id;
    weather = JSON.parse(Get(url));
  }
  let windspeed = 0;
  if(weather.wind.speed > 6) {
    windspeed = Math.round(weather.wind.speed);
  } else {
    windspeed = Math.round(weather.wind.speed * 10);
  }
  
  console.log(windspeed);
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
  allTextBlocks.forEach((item)=> {
    item.style.backgroundColor = colorBackground;
  });

  let weathertext = weather.weather[0].description + ', temprature: ' + temp + '°C, winddirection: ' + weather.wind.deg + '°, wind speed: ' + weather.wind.speed + ' m/s';

  document.querySelector('body').style.backgroundColor = colorBackground;

  document.querySelector('.initials').style.color = colorFont;
  document.querySelector('.cursor').style.backgroundColor = colorFont;

  //document.querySelector('.info').style.backgroundColor = 'rgb(' + temp + ', ' + weatherid + ', ' + wind + ')';
  document.querySelector('.info').innerHTML = weathertext;
  document.querySelector('.color').innerHTML = colorBackground;
  console.log(weatherid);
  switch(Math.round(weather.weather[0].id / 10)) {
    case 20:
      document.querySelector('body').classList.add('thunderstorm');
      break;
    case 30:
      document.querySelector('body').classList.add('fog');
      break;
    case 50:
      document.querySelector('body').classList.add('rain');
      break;
    case 60:
      document.querySelector('body').classList.add('snow');
      break;
    case 70:
      document.querySelector('body').classList.add('fog');
      break;
    case 80:
      document.querySelector('body').classList.add('clouds');
      break;
    default:
      document.querySelector('body').classList.add('default');
  }

  console.log('temp: ' + temp);
  console.log('weather ID: ' + weatherid);
  console.log('wind: ' + wind);
  console.log('windspeed: ' + weather.wind.speed);
  console.log('windspeed: ' + windspeed2);
  console.log(weather);
 
  clickLeftRight(allBtns);
  clickOutSide(allBtns);
  followCursor();
});

function clickLeftRight(elements) {
  elements.forEach((item)=> {
    item.addEventListener("click", (e) => {
      if(item.parentNode.parentNode.nextElementSibling) {
        if(item.parentNode.parentNode.nextElementSibling.classList.contains('active-animated')) {
          e.target.innerHTML = 'See it here';
          removeClass(item.parentNode.parentNode.nextElementSibling, 'active-animated');
          setTimeout(function(){removeClass(item.parentNode.parentNode.nextElementSibling, 'active')}, 500);
        } else {
          e.target.innerHTML = 'Close it here';
          addClass(item.parentNode.parentNode.nextElementSibling, 'active');
          setTimeout(function(){addClass(item.parentNode.parentNode.nextElementSibling, 'active-animated')}, 500);
        }
      } else {
        if(item.parentNode.parentNode.previousElementSibling.classList.contains('active-animated')) {
          e.target.innerHTML = 'See it here';
          removeClass(item.parentNode.parentNode.previousElementSibling, 'active-animated');
          setTimeout(function(){removeClass(item.parentNode.parentNode.previousElementSibling, 'active')}, 500);
        } else {
          e.target.innerHTML = 'Close it here';
          addClass(item.parentNode.parentNode.previousElementSibling, 'active');
          setTimeout(function(){addClass(item.parentNode.parentNode.previousElementSibling, 'active-animated')}, 500);
        }
      }
    })
  });
}

function clickOutSide(elements,) {
  window.addEventListener("click", (e) => {
    if(!e.target.classList.contains('anchor--inline')) {
      elements.forEach((itemnew)=> {
        removeClass(itemnew.parentNode.parentNode, 'active-animated');
        setTimeout(function(){removeClass(itemnew.parentNode.parentNode, 'active')}, 500);
        itemnew.innerHTML = 'See it here';
      });
    }
  });
}

function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
}

function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
}

function followCursor() {
 let cursor = document.querySelector('.cursor');
  document.addEventListener('mousemove', (e)=>{
    let x = e.clientX;
    let y = e.clientY;
    cursor.style.left = x - 10 + 'px';
    cursor.style.top = y - 10 + 'px';
  }); 

  document.querySelectorAll('.anchor').forEach((item)=>{
    item.addEventListener('mouseenter', (e)=>{
      addClass(cursor, 'over');
    });
    item.addEventListener('mouseleave', (e)=>{
      removeClass(cursor, 'over');
    });
  }); 
  
}