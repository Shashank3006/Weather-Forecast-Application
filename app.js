// Description: A weather application that fetches and displays weather data based on user input or live location tracking.
//access get serch button or create a vareble for serch button
const searchButton = document.querySelector('.location-search');
//access get live location button or create a variable for live location button
const trackLocationButton = document.querySelector('.live');
//access get recent search dropdown or create a variable for recent search dropdown
const recentSearchDropdown = document.querySelector('.recent-search-dropdown');
// API keys for weather  Api
const visual_crossing_key = "H7JBSFC8SEVAR2BUA4RVHTPFY";
// API key for OpenCage Data
const key_opencagedata = "5702d9c61ca941f08887d459625f7e49";
// Object to store coordinates for live location
const getCordinets = { latitude: "", longitude: "" };
// Object create to store weather icons address  
const weatherIcon = {
  sunny: "./resources/sunny.png",
  cloud: "./resources/cloudy.png",
  rain: "./resources/rainy.png",
  snow: "./resources/snow.png",
  clear: "./resources/clear.png",
  wind: "./resources/wind.png",
  fog: "./resources/fog.png"
};
// Array to store recent searches used LocalStorage to store recent searches
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
// Function to fetch weather data based on city name
async function getForecastCityName(city) {
  // Check if the city name is empty or null

  if (city==""||city==null) {
    // If the city name is empty or null, show a warning alert using SweetAlert
        Swal.fire({
            title: "City Name Required",
            text: "Please enter a city name.",
            icon: "warning",
            confirmButtonText: 'OK'
        });
        return false;
    }
    

// Show loading alert using SweetAlert
  Swal.showLoading();

  try {
    // Construct the API URL using the city name and API key
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${visual_crossing_key}`;
    // Fetch weather data from the API
    const response = await fetch(apiUrl);
    // Check if the response is ok  then throw an error 
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    Swal.fire({
      title: "Weather Data Fetched",
      text: `Weather data for ${city} fetched successfully!`,
      icon: "success",
      confirmButtonText: 'ok'
    });
// Update the recent searches dropdown or  data show in the today highlight section
    updateOtherWeatherDetails(data);
    // Show the weather data in the side dashboard 
    showdataSideDeshboard(data, city);
    // Show the five-day forecast
    showfivedaysforcast(data);

  } catch (error) {
    // If there is an error during the fetch operation, catch it
    // If there is an error, show an error alert using SweetAlert
    Swal.fire({
      title: "Error",
      text: `Could not fetch weather data for ${error.message}. `,
      icon: "error",
      confirmButtonText: 'OK'
    });
    // Log the error to the console
    console.error('Fetch error:', error);
  }
}
// Function to get live location forecast
async function livelocationforecast() {
  // Check if geolocation is supported by the browser
  if (!navigator.geolocation) {
    // If geolocation is not supported, show a warning alert using SweetAlert
    Swal.fire({
      title: "Geolocation Not Supported",
      text: "Your browser does not support geolocation.",
      icon: "warning",
      confirmButtonText: 'OK'
    });
    // Return false to stop further execution
    return false;
  }
// 
  try {
    // Get the current position using the Geolocation API and get the coordinates latitude and longitude
    const live = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    getCordinets.latitude = live.coords.latitude;
    getCordinets.longitude = live.coords.longitude;
// OpenCage Data API Using the coordinates to get the city name 
    const opencagedata_Api = `https://api.opencagedata.com/geocode/v1/json?q=${getCordinets.latitude}+${getCordinets.longitude}&key=${key_opencagedata}`;
    const response = await fetch(opencagedata_Api);
    const locationData = await response.json();

    const city = locationData.results[0]?.components?.city ||
                 locationData.results[0]?.components?.town ||
                 locationData.results[0]?.components?.village ||
                 locationData.results[0]?.components?.state;

    if (!city) {
      // If the city could not be determined, show an alert
      Swal.fire({
        title: "Location Error",
        text: "Could not determine city from your location.",
        icon: "error",
        confirmButtonText: 'OK'
      });
      
      return false;
    }
//  if the city is determined, call the getForecastCityName function with the city name
    getForecastCityName(city);
  } catch (error) {
  // If there is an error getting the location, show an Swal alert
    Swal.fire({
      title: "Location Error",
      text: `Failed to get location: ${error.message}`,
      icon: "error",
      confirmButtonText: 'OK'
    });
  }
}
// Function to display weather data in the side dashboard
function showdataSideDeshboard(data, locationName) {
  // Access the elements
  const WeatherSection = document.querySelector('.main-weather-section');
  const WeatherImage = document.querySelector('.main-weather-section .location-weather-image');
  const LocationName = document.querySelector('.main-weather-section .location-name');
  const LocationTemp = document.querySelector('.main-weather-section .location-temp');
  const LocationDateTime = document.querySelector('.main-weather-section .location-date-time');
  const LocationDescription = document.querySelector('.main-weather-section .location-weather-description');
// Destructure the data to get the necessary information
  let { address: name } = data;
  // Get the first day's weather data
  const { icon, temp, datetime: date, description } = data?.days[0];
  let iconImageURL = null;
// Set the name to the provided locationName or the address from data
  // If locationName is provided, use it; otherwise, use the address from data
  name = locationName || name;
// Map the icon to the corresponding weather image URL
  Object.keys(weatherIcon).forEach(key => {
    if (icon.toLowerCase().includes(key)) {
      iconImageURL = weatherIcon[key];
    }
  });
// Update the DOM elements with the weather data
  WeatherSection.style.display = "block";
  
  WeatherImage.src = iconImageURL || weatherIcon.clear;
  WeatherImage.title = icon;
  LocationName.textContent = name.toUpperCase();
  LocationTemp.textContent = `${temp} °C`;
  LocationDateTime.textContent = date;
  LocationDescription.textContent = description;
}
// Function to display the five-day forecast
function showfivedaysforcast(weatherData) {
  // Access the extended forecast container and clear any previous content
  const extendedForecastContainer = document.querySelector('.extended-forecast-container');
  extendedForecastContainer.innerHTML = '';
// Loop through the weather data for the next five days (excluding today)
  weatherData?.days?.slice(1, 6).forEach(day => {
    // Destructure the day object to get the necessary information
    const { datetime: date, icon, temp, humidity, windspeed } = day;
// Create the necessary HTML elements for each day's forecast
    const article = document.createElement('article');
    const heading = document.createElement('h3');
    const image = document.createElement('img');
    const tempEl = document.createElement("p");
    const humidityEl = document.createElement("p");
    const windEl = document.createElement("p");
// Set the class names for styling  
    article.className = "bg-gray-700 text-white space-y-2 flex-grow min-[385px]:flex-grow-0 text-center w-fit p-3 rounded-xl shadow-lg";
    image.className = "w-36 mx-auto min-[385px]:mx-0 my-5";
    heading.className = "font-bold text-lg text-white";
    
    //get day name from Date
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    heading.textContent = dayName;
    tempEl.textContent = `Temp: ${temp} °C`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    windEl.textContent = `Wind: ${windspeed} mph`;

    article.title = icon;
// Set the image source based on the icon type
    Object.keys(weatherIcon).forEach(type => {
      if (icon.toLowerCase().includes(type)) {
        image.src = weatherIcon[type];
      }
    });
    // Append the elements to the article
    article.append(heading, image, tempEl, humidityEl, windEl);
    // Append the article to the extended forecast container
    extendedForecastContainer.appendChild(article);
  });
}
// Function to update other weather details in the dashboard
function updateOtherWeatherDetails(weatherData) {
  // Access the container for other weather details and clear any previous content
  const container = document.querySelector('.other-weather-section');
  container.innerHTML = '';
//  Destructure the necessary properties from the first day's weather data
  const { dew, humidity, precip, windspeed, uvindex, visibility } = weatherData?.days[0] || {};
  const props = { dew, humidity, precip, windspeed, uvindex, visibility };
// Create an array of properties to display
  Object.keys(props).forEach(prop => {
    //create the HTML elements 
    const article = document.createElement('article');
    const heading = document.createElement('h3');
    const value = document.createElement('p');
    // Set the class names for styling
    article.className = "bg-gray-700 text-white flex-grow min-[360px]:flex-grow-0 w-[140px] h-[120px] text-center p-3 rounded-xl shadow-xl";
    heading.className = "font-semibold text-xl text-white";
    value.className = "mt-3 text-lg text-white";
  
    heading.textContent = prop.toUpperCase();
    // Set the value text content based on the property
    value.textContent = props[prop];
    if (prop === "dew") value.textContent += " °C";
    else if (prop === "precip") value.textContent += " mm";
    else if (prop === "humidity") value.textContent += " %";
    else if (prop === "windspeed") value.textContent += " mph";
    else if (prop === "visibility") value.textContent += " km";

    // Append the heading and value to the article
    article.append(heading, value);
    // Append the article to the container
    container.appendChild(article);
  });
}

// Function to update the recent search dropdown
function updateRecentSearchDropdown() {
  // Access the recent search dropdown and clear any previous content
  recentSearchDropdown.innerHTML = '';
  // Set the background  to transparent
   recentSearchDropdown.style.backgroundColor = 'transparent'
// Loop through the recent searches and create elements for each city
  recentSearches.forEach(city => {
    // Create a new div element for each city
    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    cityElement.className = 'recent-search-item text-white px-4 py-2 hover:bg-gray-600 cursor-pointer transition-all duration-200 bg-transparent h-5';
    // Add a click event listener to each city element
    // When clicked, set the input value to the city name and fetch the weather data 
    cityElement.addEventListener('click', function () {
      document.querySelector('.location-input').value = city;
      getForecastCityName(city);
    });
// Append the city element to the recent search dropdown
    recentSearchDropdown.appendChild(cityElement);
  });
}
// Event listeners for the search and live location buttons
trackLocationButton.addEventListener('click', livelocationforecast);
// Access the search button and add a click event listener
searchButton.addEventListener('click', function () {
    // Get the city name from the input field and trim any whitespace
  const cityName = document.querySelector(".location-input").value.trim();
  // Check if the city name is empty or null
    if (cityName==""||cityName==null) {
        Swal.fire({
            title: "City Name Required",
            text: "Please enter a city name.",
            icon: "warning",
            confirmButtonText: 'OK'
        });
        return false;
    }
// Call the function to get the weather data for the specified city
  getForecastCityName(cityName);
// Check if the city name is not in the recent searches array then add it
  if (!recentSearches.includes(cityName)) {
    recentSearches.push(cityName);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    // call the Update list
    updateRecentSearchDropdown();
  }
});

updateRecentSearchDropdown();
