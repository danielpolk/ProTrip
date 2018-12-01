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


//gas station API function to be in the ajax call below it
function gasStationFinder(lon, lat, city_input) {
    // inserting lat and lon taken from the restaurant API into the gas prices API since it doesnt accept city names
    var queryURL = "http://api.mygasfeed.com/stations/radius/" + lat + "/" + lon + "/7/reg/Price/bpxxw96ps2.json";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        gasStationResponse(response, city_input);
    })
};


function gasStationResponse(response, city_input) {
    // setting the loop limit
    var card_counter = 10;
    for (var i = 0; i < card_counter; i++) {
        // storing unique gas station ids
        var gas_id = response.stations[i].id;
        // storing gas station names
        var gas_station_name = response.stations[i].station;
        // storing the station's prices
        var gas_price = response.stations[i].reg_price;
        // storing station addresses
        var gas_address = response.stations[i].address
        // storing station City name
        var gas_city_name = response.stations[i].city;
        // storing station State name
        var gas_state = response.stations[i].region;
        // storing station zip code
        var gas_zipcode = response.stations[i].zip;
        // return city name input with first letter upper case
        city_input = city_input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        //exclude gas station name if unbranded and no gas price and city name other than user input
        if (gas_station_name !== "Unbranded" && gas_price !== "N/A" && gas_city_name === city_input) {
            // creating cards for gas information
            var gas_div_col = $("<div>").addClass("col s12 m6")
            // creating div for card structure
            var gas_div = $("<div>").addClass("card")
            // creating div for card structure
            var gas_div_image = $("<div>").addClass("card-image")
            // creating img element and setting its source
            var gas_main_img = $("<img>").attr("src", "assets/images/GasStationLogos/GasBackground.jpeg")
            // creating h2 for the gas station name
            var gas_name_span = $("<h2>").addClass("card-title").text(gas_station_name);
            // storing img path for gas station logos by inserting station name into path
            var gas_logo_url= 'assets/images/GasStationLogos/' + gas_station_name + '.png"'
            // grabbing text of gas_logo to insert as a class of a div
            var gas_logo_text = '"gas_logo"'
            // creating div with class of gas_logo and setting the background img url of div to
            var gas_logo = $('<div class=' + gas_logo_text + ' style="background-image: url(' + gas_logo_url + ')"></div>')
            // creating favorite button for gas
            var gas_fav_btn = $("<a class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>").attr("id", gas_id).attr("value", "gas");
            // creating div for card structure
            var gas_div_content = $("<div>").addClass("card-content")
            // creating an h5 that displays the price per gallon
            var prices = $('<h5>').addClass('gas-price').text("$" + gas_price + "/gal");
            // line breaks for spacing
            var line_break2 = $("<br>");
            var line_break3 = $("<br>");
            // creating span for station's full address
            var gas_address_span = $("<span>").addClass("left").text("Address: " + gas_address + " " + gas_city_name + ", " + gas_state + ", " + gas_zipcode);
            // eliminating spaces between station address to be inserted into Google Maps URL
            var replaced = gas_address.split(' ').join('+');
            // insert spaceless address into Google Maps URL
            var gas_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>")
            // appending image, station name, logo, and favorite button to the img div
            gas_div_image.append(gas_main_img).append(gas_name_span).append(gas_logo).append(gas_fav_btn);
            // appending the gas price, line breaks, address, and Google Maps link to gas content div
            gas_div_content.append(prices).append(line_break2).append(gas_address_span).append(line_break3).append(gas_google_link);
            // appending image and content div to parent div
            gas_div.append(gas_div_image).append(gas_div_content);
            // appending the parent div to col for card structure and creation
            gas_div_col.append(gas_div);

        } // adds 1 to the loop limit if a gas station name of price isnt listed so that limit stays 10 
        else if (gas_station_name === "Unbranded" || gas_price === "N/A") {
            // incrememting card_counter by 1
            card_counter++;
        }
        // append the gas cards we created to the HTML
        $("#gas_cards").append(gas_div_col);

    }
}


function restaurantFinder() {
    // get started button click function
    $("#submit-button").on("click", function (e) {
        // emptying out the divs so that the search is fresh
        $('#gas_cards').empty();
        $('#food_cards').empty();
        $('#event_cards').empty();
        // prevent refresh of page on enter
        e.preventDefault();
        // taking the value of the city inputted
        city_input = $("#city_input").val().trim().toLowerCase();
        // taking the value of the state inputted
        state_input = $("#state_input").val();
        // getting the city ID for Zomato API
        var queryURL = "https://developers.zomato.com/api/v2.1/cities?apikey=e54720b38895f113317f79aa68f4ca8e&q=" + city_input;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // if there is a repsonse
            if (response.location_suggestions.length != 0) {
                // smooth scroll to city and state name div
                $('html, body').animate({
                    scrollTop: $("#titleSection").offset().top
                }, 800);
                // loop through the restaurant responses
                for (let index = 0; index < (response.location_suggestions.length); index++) {
                    // storing the city name for checking
                    var cityCheck = (JSON.stringify(response.location_suggestions[index].name)).toLowerCase();
                    // storing state name for checking
                    var stateCheck = response.location_suggestions[index].state_name;
                    // if the cityCheck var includes the city inputted and the state check var includes the state inputted
                    if (cityCheck.includes(city_input) && stateCheck.toLowerCase().includes(state_input.toLowerCase())) {
                        // getting the city ID from the first API call
                        var storedCityID = response.location_suggestions[index].id;
                        // get another API call from Zomato API
                        var queryURL2 = "https://developers.zomato.com/api/v2.1/search?apikey=e54720b38895f113317f79aa68f4ca8e&entity_id=" + storedCityID + "&entity_type=city";
                        $.ajax({
                            url: queryURL2,
                            method: "GET"
                        }).then(function (response) {
                            // get the longitude and latitude to use it for the Gas Feed API
                            lon = response.restaurants[0].restaurant.location.longitude;
                            lat = response.restaurants[0].restaurant.location.latitude
                            // now call the gas station apu to run
                            gasStationFinder(lon, lat, city_input);
                            // now call event finder to run with city name input
                            eventFinder(city_input);
                            // push the response into this function and call it
                            restaurantResponse(response);
                        })
                    }
                }
            } else { // run this if there are no reponses from API
                // blur main section
                $("#main-section").addClass("blur-effect");
                // show the spell wrong modal in front of blurred main
                $('#oopsie').show();
                // click event on the misspell modal button
                $("#close-btn").on("click", function (e) {
                    // unblur main section
                    $("#main-section").removeClass("blur-effect");
                    // hide the spell wrong modal
                    $('#oopsie').hide();
                    // hiding misspelled city name
                    $('#selectedCity').empty();
                });
            }
        });
    });
};
restaurantFinder();


$('#oopsie').hide();

function eventFinder(city_input) {
    // eliminating spaces in city if there are any
    var city_name_nospace = city_input.split(' ').join('+');
    // inserting the spaceless city name into the ticket master API URL
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city_name_nospace + "&apikey=hhGX8q6JtGAAl35uFcsEeWLTAuCdjSVc&size=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // run for loop through the ticket master response
        for (var i = 0; i < (response._embedded.events.length); i++) {
            // store event names
            var event_name = response._embedded.events[i].name;
            // store event dates
            var event_date = response._embedded.events[i].dates.start.localDate;
            // store event times (military time)
            var event_time = response._embedded.events[i].dates.start.localTime;
            // convert event times to standard time
            var event_time_std = moment(event_time, 'HH:mm').format('hh:mm A');
            // store event venue's addresses
            var event_venue = response._embedded.events[i]._embedded.venues[0].address.line1;
            // store event venue name
            var event_venue_name = response._embedded.events[i]._embedded.venues[0].name;
            // store images associated with event
            var event_img = response._embedded.events[i].images[0].url;
            // store link to ticketmaster event URL
            var event_link = response._embedded.events[i].url;
            // store unique event ID
            var event_id = response._embedded.events[i].id;
            // store current date to be compared later
            var this_month = new Date();
            // stores dates of all events in response
            var dates = new Date(event_date);
            // stores the months of the events in response
            var event_months = dates.getMonth();

            // check if event date is within the same month as now using vars above
            if (event_months == this_month.getMonth()) {
                // creating a card to display the events within the month
                var event_div_col = $("<div>").addClass("col s12 m6")
                // creating div for card structure
                var event_div = $("<div>").addClass("card")
                // creating div for card structure that will hold info
                var event_div_image = $("<div>").addClass("card-image")
                // creating img element with api event img and storing it
                var event_main_img = $("<img>").attr("src", event_img)
                // creating span for event name and inserting even name as text
                var event_name_span = $("<span>").addClass("card-title").text(event_name)
                // creating event favorite button
                var event_fav_btn = $("<a class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>").attr("id", event_id).attr("value", "event");
                // creating div for card structure
                var event_div_content = $("<div>").addClass("card-content")
                // creating link to buy tickets
                var event_tickets = $("<a href='" + event_link + "' class='left'>Buy Tickets</a>")
                // line breaks for spacing
                var line_break1 = $("<br>");
                var line_break2 = $("<br>");
                // creating span for event date and time
                var event_date_span = $("<span>").addClass("left").text("Show Date: " + event_date + " at " + event_time_std);
                var line_break3 = $("<br>");
                // creating span for event address
                var event_address_span = $("<span>").addClass("left").text("Event Address: " + event_venue + " at " + event_venue_name);
                // eliminating spaces between even venue address to insert into Google Maps URL
                var replaced = event_venue.split(' ').join('+');
                // inserting spaceless venue address into Google Maps URL
                var event_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>")
                // Appending event image, name, and favorite button to event div for the image
                event_div_image.append(event_main_img).append(event_name_span).append(event_fav_btn);
                // appending ticket link, line breaks, date, address, and Google Maps link to event div for the content
                event_div_content.append(event_tickets).append(line_break1).append(event_date_span).append(line_break2).append(event_address_span).append(line_break3).append(event_google_link);
                // appending image and content div to parent event div
                event_div.append(event_div_image).append(event_div_content);
                // pushing parent event div to its parent col div
                event_div_col.append(event_div);
<<<<<<< HEAD
            } $("#event_cards").text("Sorry, there are no events this month in " + city_input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            }));
            
=======
            } else {
                $("#event_cards").text("Sorry, there are no events this month in " + city_input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                }));

            }
>>>>>>> efeaf770b7783f398efe4b957559ded61ff3fbc3
            // append the card we created above to the HTML
            $("#event_cards").append(event_div_col);
        }
    })
};


function restaurantResponse(response) {
    // setting limit of the for loop
    var card_counter = 10;
    for (var i = 0; i < card_counter; i++) {
        // storing restaurant names
        var res_name = response.restaurants[i].restaurant.name;
        // storing restaurant images
        var res_main_img = response.restaurants[i].restaurant.featured_image;
        // storing the colors of the rating
        var color_rating = response.restaurants[i].restaurant.user_rating.rating_color;
        // storing the ratings
        var res_rating = response.restaurants[i].restaurant.user_rating.aggregate_rating;
        // storing link to menus
        var menu_link = response.restaurants[i].restaurant.menu_url;
        // storing restaurant addresses
        var res_address = response.restaurants[i].restaurant.location.address;
        // storing the restaurants unique IDs
        var res_id = response.restaurants[i].restaurant.id;
        // storing restaurant cities
        var res_city = response.restaurants[i].restaurant.location.city;

        // creating cards with the reaturant infos
        var food_div_col = $("<div>").addClass("col s12 m6")
        var food_div = $("<div>").addClass("card")
        var food_div_image = $("<div>").addClass("card-image responsive-img")
        // checking for an image given by the API
        if (res_main_img == "") {
            // if API img empty, insert our image
            var food_main_img = $("<img>").attr("src", "assets/images/sub-res-image.jpeg")
        } else {
            // if API has img, use it
            var food_main_img = $("<img>").attr("src", res_main_img)
        }
        // create span for restaurant name with added classes and restaurant name as text
        var food_name_span = $("<span>").addClass("card-title white-text-with-blue-shadow").text(res_name)
        // creating the favorite button for the food
        var food_fav_btn = $("<a class='fav-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>favorite</i></a>").attr("id", res_id).attr("value", "restaurant");
        // creating the foot rating div with the rating color as the background
        var food_rating = $("<div class='btn-small rating-btn' style='background-color:#" + color_rating + "';>" + res_rating + "/5</div>")
        var food_div_content = $("<div>").addClass("card-content")
        // creating an a tag with text for the menu link
        var food_menu = $("<a href='" + menu_link + "' class='left'>See Menu</a>")
        // breaks used for spacing in the cards
        var line_break1 = $("<br>")
        var line_break2 = $("<br>")
        var line_break3 = $("<br>")
        var line_break4 = $("<br>")
        // creating span for restaurant address
        var food_address_span = $("<span>").addClass("left").text("Address: " + res_address)
        // eliminating the spaces between the address so we can insert into Google Maps URL
        var replaced = res_address.split(' ').join('+');
        // insert spaceless address into Google Maps URL
        var res_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>")
        // appending API img, name span, favorite button, and rating to the card top
        food_div_image.append(food_main_img).append(food_name_span).append(food_fav_btn).append(food_rating);
        // appending menu link, address, and Google Maps link - breaks included for spacing
        food_div_content.append(food_menu).append(line_break1).append(line_break2).append(food_address_span).append(line_break3).append(line_break4).append(res_google_link);
        // appending the food image and content to the main food div card
        food_div.append(food_div_image).append(food_div_content);
        // appending the main card to the main column
        food_div_col.append(food_div);
        // Lastly, appending the column with completed card into the main HTML
        $("#food_cards").append(food_div_col);

    }
};

// clicking the FAVORITE button on the info cards =========================
$(document.body).on("click", ".fav-btn", function () {
    // storing event ID for firebase
    let eventId = this.getAttribute("id");
    // storing value for firebase
    let value = this.getAttribute("value");

    let favKey = database.ref().child('users/' + userId + "/locations/" + city_input + "/" + value).push({
        id: eventId,
    }).getKey();

    // finding parent of the favorite button clicked, removing then adding a class for deleting, and adding attributes for database storing and calling
    $(this).parent().find(".fav-btn").removeClass("fav-btn").addClass("rmv-btn").attr("databaseKey", favKey).attr("city", city_input);
    // this changes the icon from heart to trash
    $(this).parent().find(".material-icons").text("delete");

    var divParent = $(this).parent().removeClass("fav-btn").addClass("rmv-btn");
    // storing a cloned version of the parent div
    var upperParent = divParent.parent().clone();
    // creating divs for card structure since we are cloning and moving only certain parts of the card
    var food_div_col = $("<div>").addClass("col s12 m6");
    var food_div = $("<div>").addClass("card");
    // appending the parent to the col s2 m6 for structure
    food_div.append(upperParent.children());
    // appending the column to the card div
    food_div_col.append(food_div);
    // appending the newly made div to the fav cards section
    food_div_col.appendTo("#fav_cards");
    // hide favorites paragraph now that there is content in favorites
    $("#favParagraph").addClass("hidden");
});


// To remove the favorite from the database
$(document.body).on("click", ".rmv-btn", function () {

    let value = this.getAttribute("value");
    let favKey = this.getAttribute("databaseKey");
    let city = this.getAttribute("city");
    // storing parent div of remove button clicked
    let divParent = $(this).parent();
    // storing parent of the parent of button
    let upperParent = divParent.parent()
    // another level of parent storing
    let cardParent = upperParent.parent();
    // setting the database
    database.ref('users/' + userId + "/locations/" + city + "/" + value + "/" + favKey).update({
        id: null,
    });
    // removes card from favorites
    cardParent.remove();

});