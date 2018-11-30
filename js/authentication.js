let userId;
let userName;
let currentUser;
let newMember = null;
let signedOut = null;
let dropdownItems = ["Favorites", "Logout"];

$(document).ready(function() {

    document.getElementById("user-sign-in").style.display = "none";
    let ms = document.getElementById("main-section");
    ms.classList.remove("blur-effect");
});

$("#first-sign-in-new").on("click", function(event){
  event.preventDefault();

  document.getElementById("login-btns").style.display = "none";
  document.getElementById("top-exit-btn").style.display = "block";
  document.getElementById("create-account").style.display = "block";
});

$("#first-sign-in").on("click", function(event){
  event.preventDefault();

  document.getElementById("login-btns").style.display = "none";
  document.getElementById("top-exit-btn").style.display = "block";
  document.getElementById("current-user").style.display = "block";
});

$(".no-signin").on("click", function(event){
  event.preventDefault();

  document.getElementById("login-btns").style.display = "none";
  document.getElementById("user-sign-in").style.display = "none";
  let ms = document.getElementById("main-section");
  ms.classList.remove("blur-effect");
});

//Current user sign-in
$("#sign-in").on("click", function login(event) {

  event.preventDefault();

  let userEmail = $("#email").val().trim().toLowerCase();
  let userPassword = $("#password").val().trim().toLowerCase();

  //Current user sign-in
  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
  
    //This will show if they dont have an account yet
    window.alert("Error: " + errorMessage);
  
  });
});

//Creating a new user
$("#new-member").on("click", function login(event) {

  event.preventDefault();

  userName = $("#new-username").val().trim().toLowerCase();
  let userEmail = $("#new-email").val().trim().toLowerCase();
  let userPassword = $("#new-password").val().trim().toLowerCase();
  newMember = 1;

  //Creating a new user
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
   
    window.alert("Error: " + errorMessage);
    
  });
});

$(".no-mobile").on("click", function() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     
      accountFunctions.newUserSignIn();
    } else {
      if (signedOut === null) {

  accountFunctions.noUserSignedIn();
      };
    };
  });
});

$(".sidenav-trigger").on('click', function() {

  let listValue = this.getAttribute("value");

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
      if (listValue === "0") {

        for (let i = 0; i < dropdownItems.length; i++) {
        let newList = $("<li>");
        let a = $("<a>").addClass("dropdown-item left").attr("id", dropdownItems[i]).text(dropdownItems[i]);
        newList.html(a);
        $("#nav-mobile").append(newList);
        $(".sidenav-trigger").attr("value", "1");
        };
      };
    };
  });
});  

$(document).on("click", "#Logout", function () {

  accountFunctions.logout();

  $(".dropdown-item").remove();
  $(".no-mobile").attr("value", "0");

  let newDiv = $("<div>").attr("id", "log-out-success").addClass("container");
  let newText = $("<span>").text("Log out successful.")
  newDiv.append(newText);
  $("body").prepend(newDiv);

  signedOut = 1;
  $(".account-info").text("Login");
  setTimeout(function(){$("#log-out-success").remove();}, 2000);

});

$(document).on("click", "#Favorites", function () {

    $('html, body').animate({
        scrollTop: $("#favoritesSection").offset().top
    }, 800);
});

//This is a listener for if the user is logged in or not
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    // User is signed in.
    document.getElementById("user-sign-in").style.display = "none";
    let ms = document.getElementById("main-section");
    ms.classList.remove("blur-effect");
    userId = user.uid;

    if (newMember === 1) {
      accountFunctions.writeUserData(userId, userName);
      newMember = null;
    };

    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      currentUser = snapshot.val();
      userName = currentUser.userName;

      $(".account-info").removeAttr("onclick");
      $(".account-info").empty();
      $(".account-info").text(userName);

      userFavorites.add();

    });
  
  } else {
    if (signedOut === null) {

    setTimeout(accountFunctions.noUserSignedIn, 3000);
    } else {

      $("#fav_cards").empty();
      $("#favParagraph").removeClass("hidden");
      $(".no-mobile").attr("value", "0");
      $(".account-info").attr("onclick", "accountFunctions.noUserSignedIn()");

    };
  };
});

let userFavorites  = {

  delay: 0,

  add: function() {
    
    let locations = Object.entries(currentUser.locations);
    
    for (let i = 0; i < locations.length; i ++) {
      let favCity = locations[i];
      let cityName = favCity[0];
      let eventObj = Object.entries(favCity[1]);

      for (let i = 0; i < eventObj.length; i ++) {
        let venue = eventObj[i];
        let eventType = venue[0];
        let propertyObj = Object.entries(venue[1]);
       
        for (let i = 0; i < propertyObj.length; i ++) {
          let property = propertyObj[i];
          let eventDatabaseKey = property[0];
          let eventAPIId = Object.values(property[1])[0];
          this.eventSorter(eventType, eventAPIId, eventDatabaseKey, cityName);

        };
      };
    };
  },

  eventSorter: function(eventType, eventAPIId, eventDatabaseKey, cityName) {

    if (eventType === "gas") {
      
      this.gasAPI(eventAPIId, eventDatabaseKey, cityName);

    } else if (eventType === "event") {

      this.delay += 200;

      setTimeout(() => {
        this.eventAPI(eventAPIId, eventDatabaseKey, cityName);
      }, this.delay);

    } else if (eventType === "restaurant") {

      this.restaurantAPI(eventAPIId, eventDatabaseKey, cityName);

    };
    
  },

  gasAPI: function(eventAPIId, eventDatabaseKey, cityName) {

    let queryURL = "http://api.mygasfeed.com/stations/details/" + eventAPIId + "/bpxxw96ps2.json";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

      let gas_station_name = response.details.station;
      let gas_price = response.details.reg_price;
      let gas_address = response.details.address
      let gas_city_name = response.details.city;
      let gas_state = response.details.region;
      let gas_zipcode = response.details.zip;

      var gas_div_col = $("<div>").addClass("col s12 m6");
      var gas_div = $("<div>").addClass("card");
      var gas_div_image = $("<div>").addClass("card-image");
      var gas_main_img = $("<img>").attr("src", "assets/images/GasStationLogos/GasBackground.jpeg");
      var gas_name_span = $("<h2>").addClass("card-title").text(gas_station_name);
      var source = 'assets/images/GasStationLogos/' + gas_station_name + '.png"'
      var test2 = '"gas_logo"';
      var gas_logo = $('<div class=' + test2 + ' style="background-image: url(' + source + ')"></div>');
      var gas_rmv_btn = $("<a class='rmv-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>delete</i></a>").attr("id", eventAPIId).attr("value", "gas").attr("databaseKey", eventDatabaseKey).attr("city", cityName);

      var gas_div_content = $("<div>").addClass("card-content");
      var prices = $('<h5>').addClass('gas-price').text("$" + gas_price + "/gal");
      var line_break2 = $("<br>");
      var line_break3 = $("<br>");
      var gas_address_span = $("<span>").addClass("left").text("Address: " + gas_address + " " + gas_city_name + ", " + gas_state + ", " + gas_zipcode);
      var replaced = gas_address.split(' ').join('+');
      var gas_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>");

      gas_div_image.append(gas_main_img).append(gas_name_span).append(gas_logo).append(gas_rmv_btn);
      gas_div_content.append(prices).append(line_break2).append(gas_address_span).append(line_break3).append(gas_google_link);
      gas_div.append(gas_div_image).append(gas_div_content);
      gas_div_col.append(gas_div);

      $("#fav_cards").append(gas_div_col);
      $("#favParagraph").addClass("hidden");


    });

  },

  eventAPI: function(eventAPIId, eventDatabaseKey, cityName) {

    let queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?id=" + eventAPIId + "&apikey=hhGX8q6JtGAAl35uFcsEeWLTAuCdjSVc";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response, status, req) {
      let event_name = response._embedded.events[0].name;
      let event_date = response._embedded.events[0].dates.start.localDate;
      let event_time = response._embedded.events[0].dates.start.localTime;
      let event_time_std = moment(event_time, 'HH:mm').format('hh:mm A'); 
      let event_venue = response._embedded.events[0]._embedded.venues[0].address.line1;
      let event_venue_name = response._embedded.events[0]._embedded.venues[0].name;
      let event_img = response._embedded.events[0].images[0].url;
      let event_link = response._embedded.events[0].url;

      let event_div_col = $("<div>").addClass("col s12 m6")
      let event_div = $("<div>").addClass("card")
      let event_div_image = $("<div>").addClass("card-image")
      let event_main_img = $("<img>").attr("src", event_img)
      let event_name_span = $("<span>").addClass("card-title").text(event_name)
      let event_rmv_btn = $("<a class='rmv-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>delete</i></a>").attr("id", eventAPIId).attr("value", "event").attr("databaseKey", eventDatabaseKey).attr("city", cityName);
      let event_div_content = $("<div>").addClass("card-content");
      let event_tickets = $("<a href='" + event_link + "' class='left'>Buy Tickets</a>");
      let line_break1 = $("<br>");
      let line_break2 = $("<br>");
      let event_date_span = $("<span>").addClass("left").text("Show Date: " + event_date + " at " + event_time_std);
      let line_break3 = $("<br>");
      let event_address_span = $("<span>").addClass("left").text("Event Address: " + event_venue + " at " + event_venue_name);
      let replaced = event_venue.split(' ').join('+');
      let event_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>");

      event_div_image.append(event_main_img).append(event_name_span).append(event_rmv_btn);
      event_div_content.append(event_tickets).append(line_break1).append(event_date_span).append(line_break2).append(event_address_span).append(line_break3).append(event_google_link);
      event_div.append(event_div_image).append(event_div_content);
      event_div_col.append(event_div);

      $("#fav_cards").append(event_div_col);
      $("#favParagraph").addClass("hidden");


    })
    .fail((req, status, err) => {
      // console.log(req.status);
      // TODO Handle errors/failures on request
    })
  },

  restaurantAPI: function(eventAPIId, eventDatabaseKey, cityName) {

    let queryURL = "https://developers.zomato.com/api/v2.1/restaurant?apikey=e54720b38895f113317f79aa68f4ca8e&res_id=" + eventAPIId;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

      let res_name = response.name;
      let res_main_img = response.featured_image;
      let color_rating = response.user_rating.rating_color;
      let res_rating = response.user_rating.aggregate_rating;
      let menu_link = response.menu_url;
      let res_address = response.location.address;

      let food_div_col = $("<div>").addClass("col s12 m6");
      let food_div = $("<div>").addClass("card");
      let food_div_image = $("<div>").addClass("card-image");
      let food_main_img;
      if (res_main_img == "") {
          food_main_img = $("<img>").attr("src", "assets/images/sub-res-image.jpeg");
      } else {
          food_main_img = $("<img>").attr("src", res_main_img);
      }

      let food_name_span = $("<span>").addClass("card-title white-text-with-blue-shadow").text(res_name);
      let food_rmv_btn = $("<a class='rmv-btn btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>delete</i></a>").attr("id", eventAPIId).attr("value", "restaurant").attr("databaseKey", eventDatabaseKey).attr("city", cityName);
      let food_rating = $("<div class='btn-small rating-btn' style='background-color:#" + color_rating + "';>" + res_rating + "/5</div>");
      let food_div_content = $("<div>").addClass("card-content");
      let food_menu = $("<a href='" + menu_link + "' class='left'>See Menu</a>");
      let line_break1 = $("<br>");
      let line_break2 = $("<br>");
      let line_break3 = $("<br>");
      let food_address_span = $("<span>").addClass("left").text("Address: " + res_address);
      let replaced = res_address.split(' ').join('+');
      let res_google_link = $("<a href='https://www.google.com/maps/place/" + replaced + "' target='_blank' class='left'>Map link</a>");
      food_div_image.append(food_main_img).append(food_name_span).append(food_rmv_btn).append(food_rating);
      food_div_content.append(food_menu).append(line_break1).append(line_break2).append(food_address_span).append(line_break3).append(res_google_link);
      food_div.append(food_div_image).append(food_div_content);
      food_div_col.append(food_div);

      $("#fav_cards").append(food_div_col);
      $("#favParagraph").addClass("hidden");

    });
  },
};

let accountFunctions = {

  newUserSignIn: function() {

    let listValue = $(".no-mobile").attr("value");
  
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
        if (listValue === "0") {
  
          for (let i = 0; i < dropdownItems.length; i++) {
          let newList = $("<li>");
          let a = $("<a>").addClass("dropdown-item right").attr("id", dropdownItems[i]).text(dropdownItems[i]);
          newList.html(a);
          $("#dropdown-menu").append(newList);
          $(".no-mobile").attr("value", "1");
            };
  
        } else {
          $(".dropdown-item").remove();
          $(".no-mobile").attr("value", "0");
        };
      };
    });
  }, 

  logout: function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  },
  
  writeUserData: function(userId, userName) {
    firebase.database().ref('users/' + userId).set({
      userName: userName,
      locations: "",
    });
  },
  
  noUserSignedIn: function() {
  
    // No user is signed in.
    document.getElementById("user-sign-in").style.display = "block";
    document.getElementById("login-btns").style.display = "block";
    document.getElementById("create-account").style.display = "none";
    document.getElementById("current-user").style.display = "none";
    $("#fav_cards").empty();

    let ms = document.getElementById("main-section");
    ms.classList.add("blur-effect");
  
    userId;
    userName;
    currentUser;
    newMember = null;
    signedOut = null;
  
    $(".account-info").attr("onclick", "noUserSignedIn()");
    $(".account-info").empty();
    $(".account-info").text("Login");
  
  }
};

