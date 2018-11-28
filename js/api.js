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
    var queryURL = "http://api.mygasfeed.com/stations/radius/" + lat + "/" + lon + "/4/reg/Price/bpxxw96ps2.json";
    // console.log("station url: " + queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log("gas response" + JSON.stringify(response));
        gasStationResponse(response, city_input);


    })
};


function gasStationResponse(response, city_input) {


    for (var i = 0; i < 8; i++) {
        var gas_station_name = response.stations[i].station;
        var gas_price = response.stations[i].reg_price;
        var gas_address = response.stations[i].address
        var gas_city_name = response.stations[i].city;
        var gas_state = response.stations[i].region;
        var gas_zipcode = response.stations[i].zip;
        // console.log('this is the city name' + i + ' ' + gas_city_name)
        //to return city name input with first letter upper case
        city_input = city_input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        //exclude gas station name is unbranded and no gas price and city name other than user input
        if (gas_station_name !== "Unbranded" && gas_price !== "N/A" && gas_city_name === city_input) {
            console.log("testing");
            
            var gas_div_col = $("<div>").addClass("col s12 m6")
            var gas_div = $("<div>").addClass("card")
            var gas_div_image = $("<div>").addClass("card-image")
            var gas_main_img = $("<img>").attr("src", "assets/images/GasStationLogos/GasBackground.jpeg")
            var gas_name_span = $("<h2>").addClass("card-title").text(gas_station_name);
            var source = 'assets/images/GasStationLogos/' + gas_station_name + '.png"'
            var test2 = '"gas_logo"'
            var gas_logo = $('<div class=' + test2 + ' style="background-image: url(' + source + ')"></div>')
            var gas_fav_btn = $("<a id='fav-icon' class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>")
            // var event_fav_btn = $("<a class=''><i class='material-icons'>favorite_border</i></a>")

            var gas_div_content = $("<div>").addClass("card-content")
            var prices = $('<h5>').addClass('gas-price').text("$" + gas_price + "/gal");
            var line_break2 = $("<br>");
            var line_break3 = $("<br>");
            var gas_address_span = $("<span>").addClass("left").text("Address: " + gas_address + " " + gas_city_name + ", " + gas_state + ", " + gas_zipcode);
            gas_div_image.append(gas_main_img).append(gas_name_span).append(gas_logo).append(gas_fav_btn);
            gas_div_content.append(prices).append(line_break2).append(gas_address_span).append(line_break3);
            gas_div.append(gas_div_image).append(gas_div_content);
            gas_div_col.append(gas_div);




        }
        // here push the text to the div using the id
        $("#gas_cards").append(gas_div_col);
    }
}


function restaurantFinder() {
    //get started button
    $("#submit-button").on("click", function (e) {
        
        
        //prevent errors
        e.preventDefault();
        $('html, body').animate({
        scrollTop: $("#titleSection").offset().top
        }, 800);
        // make sure that the input will be all lower case and trimmed
        city_input = $("#city_input").val().trim().toLowerCase();
        // console.log("city input "+city_input)
        state_input = $("#state_input").val();
        // console.log("state input "+String(state_input))

        //getting the city ID for Zomato API
        var queryURL = "https://developers.zomato.com/api/v2.1/cities?apikey=e54720b38895f113317f79aa68f4ca8e&q=" + city_input;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if (response.location_suggestions = 0){
                $('#selectedCity').text("Spelled it wrong, dummy.")
                console.log("response null");
            } 
            for (let index = 0; index < (response.location_suggestions.length); index++) {
                var cityCheck = (JSON.stringify(response.location_suggestions[index].name)).toLowerCase();
                // console.log(cityCheck)
                var stateCheck = response.location_suggestions[index].state_name;
                // console.log(String(stateCheck))
                console.log("first statement " + stateCheck.toLowerCase().includes(state_input.toLowerCase()))
                // console.log("second statement "+(state_input == stateCheck))
                //    var helo= hello.toLowerCase();
                // var hithere=cityCheck.includes(city_input)
                if (cityCheck.includes(city_input) && stateCheck.toLowerCase().includes(state_input.toLowerCase())) {
                    // console.log("if is working")
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
                        // console.log(response.restaurants);
                        // console.log("before for loop" + response.restaurants[0].restaurant)
                        // get the longitude and latitude to use it for the Gas Feed API
                        lon = response.restaurants[0].restaurant.location.longitude;
                        console.log("sliced " + lon)
                        lat = response.restaurants[0].restaurant.location.latitude
                        
                        // console.log("this is lon: " + lon + " ; this is lat: " + lat)
                        // calling the gas feed api function to feed with longitudeand latitude from zomato API
                        gasStationFinder(lon, lat, city_input);
                        eventFinder(city_input);
                        restaurantResponse(response);
                    })
                }
            }
        });
    });
};
restaurantFinder();


function eventFinder(city_input) {
    var city_name_nospace = city_input.split(' ').join('+');
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city_name_nospace + "&apikey=hhGX8q6JtGAAl35uFcsEeWLTAuCdjSVc&size=8";
    // console.log("Event url: " + queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log("event response: " + response)
        for (var i = 0; i < (response._embedded.events.length); i++) {
            var event_name = response._embedded.events[i].name;
            var event_date = response._embedded.events[i].dates.start.localDate;
            var event_time = response._embedded.events[i].dates.start.localTime;
            var event_venue = response._embedded.events[i]._embedded.venues[0].address.line1;
            var event_venue_name = response._embedded.events[i]._embedded.venues[0].name;
            var event_img = response._embedded.events[i].images[0].url;
            var event_link = response._embedded.events[i].url;
            // creating the div for the gas station
            // create the element
            // create the text for element which will be variables below the for loop
            // push these variables to the div section
            var event_div_col = $("<div>").addClass("col s12 m6")
            var event_div = $("<div>").addClass("card")
            var event_div_image = $("<div>").addClass("card-image")
            var event_main_img = $("<img>").attr("src", event_img)
            var event_name_span = $("<span>").addClass("card-title").text(event_name)
            var event_fav_btn = $("<a id='fav-icon' class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>")
            // var event_rating = $("<div class='btn-small rating-btn' style='background-color:#" + color_rating + "';>" + res_rating + "/5</div>")
            // console.log("this is the food rating " + event_rating)
            var event_div_content = $("<div>").addClass("card-content")
            var event_tickets = $("<a href='" + event_link + "' class='left'>Buy Tickets</a>")
            var line_break1 = $("<br>");
            var line_break2 = $("<br>");
            var event_date_span = $("<span>").addClass("left").text("Show Date: " + event_date + " at " + event_time);
            var line_break3 = $("<br>");
            var event_address_span = $("<span>").addClass("left").text("Event Address: " + event_venue + " at " + event_venue_name);
            event_div_image.append(event_main_img).append(event_name_span).append(event_fav_btn);
            event_div_content.append(event_tickets).append(line_break1).append(event_date_span).append(line_break2).append(event_address_span).append(line_break3);
            event_div.append(event_div_image).append(event_div_content);
            event_div_col.append(event_div);

            $("#event_cards").append(event_div_col);
        }
    })
};


function restaurantResponse(response) {

    // console.log("food response" + response.restaurants[0].restaurant)
    for (var i = 0; i < 8; i++) {
        var res_name = response.restaurants[i].restaurant.name;
        var res_main_img = response.restaurants[i].restaurant.featured_image;
        console.log("image source " + res_main_img)
        var color_rating = response.restaurants[i].restaurant.user_rating.rating_color;
        // console.log("this is color rating "+color_rating)
        var res_rating = response.restaurants[i].restaurant.user_rating.aggregate_rating;
        // console.log("this is res rating "+res_rating)
        var menu_link = response.restaurants[i].restaurant.menu_url;
        var res_address = response.restaurants[i].restaurant.location.address;

        var food_div_col = $("<div>").addClass("col s12 m6")
        var food_div = $("<div>").addClass("card")
        var food_div_image = $("<div>").addClass("card-image")
        if (res_main_img == "") {
            var food_main_img = $("<img>").attr("src", "assets/images/sub-res-image.jpeg")
        } else {
            var food_main_img = $("<img>").attr("src", res_main_img)
        }

        var food_name_span = $("<span>").addClass("card-title white-text-with-blue-shadow").text(res_name)
        var food_fav_btn = $("<a id='fav-icon' class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>")
        var food_rating = $("<div class='btn-small rating-btn' style='background-color:#" + color_rating + "';>" + res_rating + "/5</div>")
        // console.log("this is the food rating " + food_rating)
        var food_div_content = $("<div>").addClass("card-content")
        var food_menu = $("<a href='" + menu_link + "' class='left'>See Menu</a>")
        var line_break1 = $("<br>")
        var line_break2 = $("<br>")
        var line_break3 = $("<br>")
        var food_address_span = $("<span>").addClass("left").text("Address: " + res_address)
        food_div_image.append(food_main_img).append(food_name_span).append(food_fav_btn).append(food_rating);
        food_div_content.append(food_menu).append(line_break1).append(line_break2).append(food_address_span).append(line_break3);
        food_div.append(food_div_image).append(food_div_content);
        food_div_col.append(food_div);

        $("#food_cards").append(food_div_col);
    }
};

// here push the text to the div using the id
$(document.body).on("click", ".fav-btn", function () {
    console.log($(this).parent())
    console.log("test inner text " + $(this).parent().find(".material-icons").text())
    // hello += $(this).parent().childNodes   .closest('tr').find('.sibbling').text()

        $(this).parent().find(".fav-btn").removeClass("fav-btn").addClass("rmv-btn")
        $(this).parent().find(".material-icons").text("delete");
    var divParent = $(this).parent();
    var upperParent = divParent.parent();
    // var allUpperParents = upperParent.children()
    var food_div_col = $("<div>").addClass("col s12 m6");
    var food_div = $("<div>").addClass("card");
    food_div.append(upperParent.children());
    food_div_col.append(food_div);

    console.log('this is the food div '+JSON.stringify(food_div_col))

    database.ref().child('users/' + userId).push({
        food_div_col: food_div_col,
        food_div: food_div,
        divParent: divParent,
        upperParent: upperParent
    })

    // $(food_div_col).clone(true, true).appendTo("#fav_cards");
    $("#fav_cards").append(food_div_col);
    // console.log("test user id " + childSnapshot.val().food_div)


});


// database.ref().orderByChild("dateAdded")