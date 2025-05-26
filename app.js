// const searchButton = document.querySelector('.location-search');
// const trackLocationButton = document.querySelector('.live');

// const getCordinets = {
//     latitude: "",
//     longitude: ""
// };

// const key_opencagedata = "5702d9c61ca941f08887d459625f7e49";
// const visual_crossing_key = "H7JBSFC8SEVAR2BUA4RVHTPFY";
// const weather_Api = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
// const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// // Function to fetch weather data by city name
// async function getForecastCityName(city) {
//     if (!city) {
//         alert("Please enter a city name.");
//         return;
//     }

//     alert("Fetching weather data for: " + city);

//     try {
//         const response = await fetch(`${weather_Api}${city}?key=${visual_crossing_key}`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         console.log(data); // You can process/display data here
//         alert("Weather data fetched successfully!");
//     } catch (error) {
//         console.error('There has been a problem with your fetch operation:', error);
//         alert("Please enter a valid city name or check your connection.");
//     }
// }

// // Function to fetch weather using live location
// async function livelocationforecast() {
//     if (!navigator.geolocation) {
//         alert("Geolocation is not supported by your browser.");
//         return;
//     }

//     try {
//         const live = await new Promise((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(resolve, reject);
//         });

//         getCordinets.latitude = live.coords.latitude;
//         getCordinets.longitude = live.coords.longitude;

//         const opencagedata_Api = `https://api.opencagedata.com/geocode/v1/json?q=${getCordinets.latitude}+${getCordinets.longitude}&key=${key_opencagedata}`;
//         const response = await fetch(opencagedata_Api);
//         const locationData = await response.json();

//         const city = locationData.results[0]?.components?.city ||
//                      locationData.results[0]?.components?.town ||
//                      locationData.results[0]?.components?.village ||
//                      locationData.results[0]?.components?.state;

//         if (!city) {
//             alert("Could not determine city from your location.");
//             return;
//         }

//         getForecastCityName(city);
//     } catch (error) {
//         alert("Failed to get location: " + error.message);
//     }
// }

// // Event Listeners
// trackLocationButton.addEventListener('click', livelocationforecast);
// searchButton.addEventListener('click', function () {
//     const cityName = document.querySelector(".location-input").value.trim(); // moved here to get updated input
//     getForecastCityName(cityName);

//     if (!recentSearches.includes(cityName)) {
//         recentSearches.push(cityName);
//         localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
//         updateRecentSearchDropdown();
//     }
// });


// recentSearches.forEach(city => {
//   const cityElement = document.createElement('div');
//   cityElement.textContent = city;
//   cityElement.addEventListener('click', function() {
//     document.querySelector('.recent-search-dropdown').appendChild(cityElement)
//   }
  
// });

const searchButton = document.querySelector('.location-search');
const trackLocationButton = document.querySelector('.live');
const recentSearchDropdown = document.querySelector('.recent-search-dropdown');

const getCordinets = {
    latitude: "",
    longitude: ""
};

const key_opencagedata = "5702d9c61ca941f08887d459625f7e49";
const visual_crossing_key = "H7JBSFC8SEVAR2BUA4RVHTPFY";
const weather_Api = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Function to fetch weather data by city name
async function getForecastCityName(city) {
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    alert("Fetching weather data for: " + city);

    try {
        const response = await fetch(`${weather_Api}${city}?key=${visual_crossing_key}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // You can process/display data here
        alert("Weather data fetched successfully!");
    } catch (error) {
        console.error('Fetch error:', error);
        alert("Please enter a valid city name or check your connection.");
    }
}

// Function to fetch weather using live location
async function livelocationforecast() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    try {
        const live = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        getCordinets.latitude = live.coords.latitude;
        getCordinets.longitude = live.coords.longitude;

        const opencagedata_Api = `https://api.opencagedata.com/geocode/v1/json?q=${getCordinets.latitude}+${getCordinets.longitude}&key=${key_opencagedata}`;
        const response = await fetch(opencagedata_Api);
        const locationData = await response.json();

        const city = locationData.results[0]?.components?.city ||
                     locationData.results[0]?.components?.town ||
                     locationData.results[0]?.components?.village ||
                     locationData.results[0]?.components?.state;

        if (!city) {
            alert("Could not determine city from your location.");
            return;
        }

        getForecastCityName(city);
    } catch (error) {
        alert("Failed to get location: " + error.message);
    }
}

// Update recent searches dropdown
function updateRecentSearchDropdown() {
    recentSearchDropdown.innerHTML = ''; // Clear old items

    recentSearches.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        cityElement.classList.add('recent-search-item'); // Optional: for styling
        cityElement.addEventListener('click', function () {
            document.querySelector('.location-input').value = city;
            getForecastCityName(city);
        });
        recentSearchDropdown.appendChild(cityElement);
    });
}

// Event Listeners
trackLocationButton.addEventListener('click', livelocationforecast);

searchButton.addEventListener('click', function () {
    const cityName = document.querySelector(".location-input").value.trim();
    if (!cityName) return;

    getForecastCityName(cityName);

    if (!recentSearches.includes(cityName)) {
        recentSearches.push(cityName);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        updateRecentSearchDropdown();
    }
});

// Initialize recent search list on page load
updateRecentSearchDropdown();
