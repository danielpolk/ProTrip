/* 
* input city id = icon_city
    ** the value of the input will be the city that goes into the food api

* input state id = myInput
    ** we will check the value of the state to match the api state
* submit button id = submit-button
    ** on click event where all the api are called
* restaurant divs will be in id div = food_section
    ** work on how the Div will look like
    ** work on what elements needed to be added
    ** work on what pushing the div to the page
* gas divs will be in id div = gas_section
    ** work on how the Div will look like
    ** work on what elements needed to be added
    ** work on what pushing the div to the page
* events divs will be in id div = events_section
    ** work on how the Div will look like
    ** work on what elements needed to be added
    ** work on what pushing the div to the page
* fav divs will go to id = fav_section
    ** work on how to push the element to the fav section and delete the old one
    ** work on how the Div will look like
    ** work on what elements needed to be added
    ** work on what pushing the div to the page
*/
console.log("we are live")
//gas station API function to be in the ajax call below it
function gasStationFinder(lon, lat, city_input) {
    // var nameStored = [];
    // var gasPriceStored = [];
    var queryURL = "http://api.mygasfeed.com/stations/radius/" + lat + "/" + lon + "/1/reg/Price/bpxxw96ps2.json";
    console.log("station url: " + queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        gasStationResponse(response, city_input);
    })
};

function gasStationResponse(response, city_input /* it used to be the array saved in the gasStationFinder function but moved to this function check after done */) {
    //push the value to the variables below to store 
    var gas_price_stored = [];
    var gas_city_name_stored = [];
    var gas_station_name_stored = [];
    console.log("gas station response" + response.stations[0])
    for (var i = 0; i < (response.stations.length); i++) {
        var gas_station_name = response.stations[i].station;
        var gas_price = response.stations[i].reg_price;
        var gas_city_name = response.stations[i].city;
        // console.log('this is the city name' + i + ' ' + gas_city_name)
        //to return city name input with first letter upper case
        city_input = city_input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        //exclude gas station name is unbranded and no gas price and city name other than user input
        if (gas_station_name !== "Unbranded" && gas_price !== "N/A" && gas_city_name === city_input) {
            // creating the div for the gas station
            // create the element
            // create the text for element which will be variables below the for loop
            // push these variables to the div section
        }
        // here push the text to the div using the id
    }
}


function restaurantFinder() {
    //get started button
    $("#submit-button").on("click", function (e) {
        console.log("working")
        //prevent errors?
        e.preventDefault();
        // make sure that the input will be all lower case and trimmed
        city_input = $("#city_input").val().trim().toLowerCase();
        console.log("city input "+city_input)
        state_input = $("#state_input").val();
        console.log("state input "+String(state_input))

        //getting the city ID for Zomato API
        var queryURL = "https://developers.zomato.com/api/v2.1/cities?apikey=e54720b38895f113317f79aa68f4ca8e&q=" + city_input;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            for (let index = 0; index < (response.location_suggestions.length); index++) {
                var cityCheck = (JSON.stringify(response.location_suggestions[index].name)).toLowerCase();
                console.log(cityCheck)
                var stateCheck = response.location_suggestions[index].state_name;
                // console.log(String(stateCheck))
                // console.log("first statement "+cityCheck.includes(city_input))
                // console.log("second statement "+(state_input == stateCheck))
                //    var helo= hello.toLowerCase();
                // var hithere=cityCheck.includes(city_input)
                if (cityCheck.includes(city_input) && state_input.toLowerCase() == stateCheck.toLowerCase()) {
                    console.log("if is working")
                    //getting the city ID from the first API call
                    var storedCityID = response.location_suggestions[index].id;
                    // console.log(response);
                    //get another API call from Zomato API
                    var queryURL2 = "https://developers.zomato.com/api/v2.1/search?apikey=e54720b38895f113317f79aa68f4ca8e&entity_id=" + storedCityID + "&entity_type=city";
                    // console.log("URL" + queryURL2)
                    $.ajax({
                        url: queryURL2,
                        method: "GET"
                    }).then(function (response) {
                        console.log(response.restaurants[0]);
                        // console.log("before for loop" + response.restaurants[0].restaurant)
                        // get the longitude and latitude to use it for the Gas Feed API
                        lon = response.restaurants[0].restaurant.location.longitude
                        lat = response.restaurants[0].restaurant.location.latitude
                        // console.log("this is lon: " + lon + " ; this is lat: " + lat)
                        // calling the gas feed api function to feed with longitudeand latitude from zomato API
                        gasStationFinder(lon, lat, city_input);
                        eventFinder(city_input);
                    })
                }
            }
        });
    });
};
restaurantFinder();


function eventFinder(city_input) {
    var event_name_stored = [];
    var event_date_stored = [];
    var event_venue_stored = [];
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city_input + "&apikey=hhGX8q6JtGAAl35uFcsEeWLTAuCdjSVc&size=4";
    // console.log("Event url: " + queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < (response._embedded.events.length); i++) {
            var event_name_stored = response._embedded.events[i].name;
            var event_date_stored = response._embedded.events[i].dates.start.localDate;
            var event_venue_stored = response._embedded.events[i]._embedded.venues[i];
            // creating the div for the gas station
            // create the element
            // create the text for element which will be variables below the for loop
            // push these variables to the div section
        }
    })
};
