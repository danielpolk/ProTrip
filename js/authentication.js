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
  document.getElementById("create-account").style.display = "block";
});

$("#first-sign-in").on("click", function(event){
  event.preventDefault();

  document.getElementById("login-btns").style.display = "none";
  document.getElementById("current-user").style.display = "block";
});

$("#cancel-sign-in").on("click", function(event){
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
    var errorCode = error.code;
    var errorMessage = error.message;
  
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
    var errorCode = error.code;
    var errorMessage = error.message;
   
    window.alert("Error: " + errorMessage);
    
  });
});

$(".account-info").on("click", function() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     
      newUserSignIn();
    } else {

  noUserSignedIn();
    };
  });
});


function newUserSignIn() {

  
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
};  

$(".sidenav-trigger").on('click', function() {

  let listValue = this.getAttribute("value");
  console.log(listValue);

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

// document.addEventListener('mouseup', function(e){

//   let accountMenu = $(".account-info");
//   let mobileAccountMenu = $(".sidenav-trigger");

//   if (e.target === accountMenu)  {

//     console.log("main menu");

//   } else if (e.target === mobileAccountMenu) {

//     console.log("mobile menu");

//   }

// });

$(document).on("click", "#Logout", function () {

  logout();

  $(".dropdown-item").remove();
  $(".no-mobile").attr("value", "0");

  let newDiv = $("<div>").attr("id", "log-out-success").addClass("container");
  let newText = $("<span>").text("Log out successful.")
  newDiv.append(newText);
  $("body").prepend(newDiv);

  signedOut = 1;
  console.log("signedOut: ", signedOut);
  $(".account-info").text("Login");
  setTimeout(function(){$("#log-out-success").remove();}, 2000);

  userFavorites.logout();

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
      writeUserData(userId, userName);
      newMember = null;
    };

    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      currentUser = snapshot.val();
      userName = currentUser.userName;
      console.log("current user:");
      console.log(currentUser);

      $(".account-info").removeAttr("onclick");
      $(".account-info").empty();
      $(".account-info").text(userName);

      userFavorites.add();

    });
  
  } else {

    console.log("user is NOT signed in");
    if (signedOut === null) {

    setTimeout(noUserSignedIn, 3000);
    };
  };
});

let userFavorites  = {


  add: function() {
    debugger;

    let locations = currentUser.locations;
    let size = locations.keys(myObj).length
    console.log(size);
    
    
    for (let i = 0; i < size; i ++) {
      let favCity = locations[i];

      for (let i = 0; i < favCity.length; i ++) {
      let eventType = favCity[i];

        for (let i = 0; i < eventType.length; i ++) {
          let databaseKey = eventType[i].val();
          console.log(databaseKey);

        };
      };
    };
  },

  logout: function() {

  },

};

//Signing a user out
function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
};

//Writes new members info into database
function writeUserData(userId, userName) {
  firebase.database().ref('users/' + userId).set({
    userName: userName,
    locations: "",
  });
}

//This is for the modal display to pop up if they aren't signed in
function noUserSignedIn() {

  console.log("noUserSignedIn");

  // No user is signed in.
  document.getElementById("user-sign-in").style.display = "block";
  document.getElementById("login-btns").style.display = "block";
  document.getElementById("create-account").style.display = "none";
  document.getElementById("current-user").style.display = "none";


  let ms = document.getElementById("main-section");
  ms.classList.add("blur-effect");

  userId;
  userName;
  currentUser;
  newMember = null;

  $(".account-info").attr("onclick", "noUserSignedIn()");
  $(".account-info").empty();
  $(".account-info").text("Login");
};

