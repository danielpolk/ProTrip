 //Current user sign-in
$("#sign-in").on("click", function login() {

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
$("#new-member").on("click", function login() {

  event.preventDefault();

  let userEmail = $("#email").val().trim().toLowerCase();
  let userPassword = $("#password").val().trim().toLowerCase();


  //Creating a new user
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);
    
  });

});


//This is a listener for if the user is logged in or not
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    // User is signed in.
    document.getElementsById("user-sign-in").style.display = "none";
    console.log("user is signed in");
  } else {

    // No user is signed in.
    document.getElementsById("user-sign-in").style.display = "block";

    console.log("user is NOT signed in");

  }
});

//Signing a user out
function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
};

