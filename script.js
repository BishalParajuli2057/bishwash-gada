const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".user_location");
const cityInput = document.getElementById("city-input");
const API_key = "0fb22215d4051c4148d390973915b5f8";
const humidityvalue = document.getElementById("humidityvalue");
const Temperaturevalue = document.getElementById("Temperaturevalue");
const winfspeedvalue = document.getElementById("winfspeedvalue");
const icon = document.querySelector(".icon");
const listcontainer = document.getElementById("list-container");
const checkbox = document.querySelector("input[type='checkbox']");
const inputBox = document.getElementById("input-box");
const weathCardDiv = document.querySelector(".hour_card");


const getCityCoordinates_list = (cityName) => { // used AI to see why cityName wasnot going as a parameter.
    if (!cityName) return;

    const Geocode_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    fetch(Geocode_API)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            if (!data.length) {
                alert("No coordinates found for the city.");
                return;
            }
            const name = data[0].name; // Used AI to corrected correct syntax
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeatherDetails(name, lat, lon);
            getlistdata(name);
            getDataforchart(name, lat, lon);
            getdetailfor8dayweather(name, lat, lon);
            cityInput.value = "";  //: clears city after input
            checkbox.checked = false;  // Uncheck the favorite checkbox

        }).catch(() => {
            alert("An error occurred while fetching the coordinates.");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const Geocode_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    fetch(Geocode_API)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            if (!data.length) {
                alert("No coordinates found for the city.");
                return;
            }
            const name = data[0].name;
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeatherDetails(name, lat, lon);
            getlistdata(name);
            getDataforchart(name, lat, lon);
            getdetailfor8dayweather(name, lat, lon);
            cityInput.value = "";  //: clears city after input
            checkbox.checked = false;  // Uncheck the favorite checkbox

        }).catch(() => {
            alert("An error occurred while fetching the coordinates.");
        });
};

const getWeatherDetails = (cityName, lat, lon) => {
    const Weather_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    const unit = document.getElementById("converter").value;

    fetch(Weather_API)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            // Update city name
            document.getElementById("city").innerHTML = cityName;

            // Update humidity and temperature values
            humidityvalue.innerHTML = Math.round(data.list[0].main.humidity) + "%";
            const celsiusvalue = Math.round(data.list[0].main.temp - 273.15);
            const celsius_in_string = celsiusvalue + "°C";

            // backgroundchange
            if(celsiusvalue <= 10){
                document.body.style.backgroundColor= ("#e0ffff");
            } 
            if( celsiusvalue > 10 && celsiusvalue<25){
                document.body.style.backgroundColor= ("#e0f79e");
            }
            if (celsiusvalue >= 25){
                document.body.style.backgroundColor= ("#e08787");
            }

            // change the symbols
            if (unit === 'celsius') {
                Temperaturevalue.innerHTML = celsius_in_string;
            } else if (unit === 'fahrenheit') {
                Temperaturevalue.innerHTML = ((data.list[0].main.temp - 273.15) * 9 / 5 + 32).toFixed(1) + "°F";
            }

            // Update wind speed
            winfspeedvalue.innerHTML = data.list[0].wind.speed + " m/s";

            // Update weather icon
            const iconcode = data.list[0].weather[0].icon;
            icon.style.backgroundImage = `url('https://openweathermap.org/img/wn/${iconcode}@2x.png')`;
        })
        .catch(() => {
            alert("An error occurred while fetching the weather details.");
        });
};



const getlistdata = (cityName) => {
    if (checkbox.checked) {
        const city_in_list = listcontainer.getElementsByTagName('li').length;
        if (city_in_list >= 60) {
            alert("You have achieve mach threhold to favuorite List.")
            return;
        }

        let task = document.createElement('li');  // Github and internet help & AI check for syntax 
        task.textContent = cityName;
        let span = document.createElement('span');
        span.textContent = " x";
        span.style.cursor = "pointer";
        task.appendChild(span);
        listcontainer.appendChild(task);
    }
};


listcontainer.addEventListener("click", (el) => {
    if (el.target.tagName === 'LI') {
        const listItems = listcontainer.getElementsByTagName('li');
        
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove('checked');
        }
        el.target.classList.add('checked');
        
        const cityName = el.target.textContent.replace(" x", "");
        getCityCoordinates_list(cityName); 
    } else if (el.target.tagName === 'SPAN') {
        el.target.parentElement.remove();  
    }
});




const getUserLocation = () => {
    const cityName = cityInput.value.trim();
    navigator.geolocation.getCurrentPosition(
        position => {
            //console.log(position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude; 
            getWeatherDetails(cityName, lat, lon);// took help from AI because didnot knew what to but in city name.
            getDataforchart(cityName, lat, lon);
            getdetailfor8dayweather(cityName, lat, lon);
        },
        error => {
            alert("An error occurred while fetching the weather details for current location.");
        }
    );
}


searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserLocation);


const getDataforchart = (cityName, lat, lon) => {
    const unit = document.getElementById("converter").value;
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const just_time = [];
            const temp = [];
            const windspeed = [];

            //console.log(data);

            for (let i = 0; i < 13; i++) {
                var date_time = data.list[i].dt_txt;
                just_time.push(date_time.substr(11, 5));
                windspeed.push(data.list[i].wind.speed);
                if (unit === 'celsius') {
                    temp.push(Math.round(data.list[i].main.temp - 273.15)) + "°C";
                } else if (unit === 'fahrenheit') {
                    temp.push(parseFloat(((data.list[i].main.temp - 273.15) * 9 / 5 + 32).toFixed(1))) + "°F";
                }

            }
            function formatTime(number) {
                return number < 10 ? '0' + number : number;
            }

            let now = new Date();
            let hours = formatTime(now.getHours());
            let minutes = formatTime(now.getMinutes());

            let currentTime = `${hours}:${minutes}`;

            //console.log(Current Time: ${currentTime});

            chartbuild(just_time, temp, currentTime, windspeed);
        })
        .catch(() => {
            alert("An error occurred while fetching the weather details in hour.");
        });
};


const chartbuild = (just_time, temp, currentTime, windspeed) => {
    const unit = document.getElementById("converter").value;

    const chartData = {
        labels: just_time,
        datasets: [
            {
                name: "tempeture", type: "bar",
                values: temp
            },
            {
                name: "wind speed", type: "line",
                values: windspeed
            }
        ]
    };

    let degree;

    if (unit === 'celsius') {
        degree = "Celsius";
    } else if (unit === 'fahrenheit') {
        degree = "Fahrenheit";
    }

    const chart = new frappe.Chart("#chart", {
        title: "3-hour Weather Forecast",
        data: chartData,
        type: "line",
        height: 400,
        colors: ['#f50f0f'],
        lineOptions: {
            hideDots: 1,
            regionFill: 0
        },
        axisOptions: {
            xAxisMode: "tick",
            xIsSeries: true,
            yAxisTitle: degree
        },
        annotations: {
            x: [
                {
                    label: "Current time",
                    value: currentTime,
                    type: "line"
                }
            ]
        }
    });
};

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h1>Tempeture: ${(weatherItem.main.temp)}</h1>
                <h1>Wind speed: ${weatherItem.wind.speed} m/s</h1>
                <h1>Humidity: ${weatherItem.main.humidity}%</h1>
            </li>`;
};

const getdetailfor8dayweather = (cityName, lat, lon) => {
    const unit = document.getElementById("converter").value;
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const uniqueWeatherForecastDays = [];
            const eigthDayForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueWeatherForecastDays.includes(forecastDate)) {
                    return uniqueWeatherForecastDays.push(forecastDate);
                }
            });

            cityInput.value = "";
            weathCardDiv.innerHTML = "";

            //console.log(eigthDayForecast);

            eigthDayForecast.forEach((weatherItem) => { // Github and open suorce media and AI syntax corrrection
                let temperature = Math.round(weatherItem.main.temp - 273.15);
                let temperatureSymbol = "°C";
                if (unit === "fahrenheit") {
                    temperature = (temperature * 9 / 5) + 32;
                    temperatureSymbol = "°F";
                }
                weatherItem.main.temp = `${temperature}${temperatureSymbol}`;
                weathCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));

            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather details.");
        });
}; 


