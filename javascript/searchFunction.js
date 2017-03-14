// connection to firebase
var config = {
    apiKey: "AIzaSyBEEv7CBXzPa2wgm2AVAynA6pJ0DC_kovs",
    authDomain: "trippy-c8caf.firebaseapp.com",
    databaseURL: "https://trippy-c8caf.firebaseio.com",
    storageBucket: "trippy-c8caf.appspot.com",
    messagingSenderId: "964170356211"
};
// initialze App
firebase.initializeApp(config);
// create shorter version to reference firebase db
var db = firebase.database();
// Load recent searches from Firebase
var ref = db.ref();
var currentCounter = 0;
ref.once("value")
    .then(function(snapshot) {
        // pull total views from firebase
        currentCounter = snapshot.val().Counter;
        // increment counter
        currentCounter++;
        // change the value in firebase
        db.ref().update({
            Counter:currentCounter
        });
        // display view count on page
        $("#visitCounter").html("Total Views: " + currentCounter);

        // loop through each of the searches in firebase
        snapshot.forEach(function(childSnapshot) {
            var cityName = childSnapshot.val().searchTerm;
            //console.log(cityName);
        });
    });

//create one instance of the google Object (Test)
var sbgoogleObj = googleObj; //sb stands for 'search button'
var currentSearchTerm = null; //this variable holds the latest search for when the user switches tabs
    // when the search button is clicked, do something

$("#searchBtn").on("click", function() {
    if ($("#searchTerm").val().length !== 0) {
        // use getSearchTerm function to clean up and get search term
        var searchTerm = getSearchTerm();
        $("#citySearched").text(searchTerm);
        // call function to pull API info

        getCityInfo(searchTerm,"");
        // call function to put search term on page

        putSearchTermOnPage(searchTerm);
        $("#searchTerm").val("");
    }
});

// assign on click function to search history terms
$(document).on("click", ".searchHistoryTerms", function() {
    var searchTerm = $(this).attr("data-term");
    $("#citySearched").text(searchTerm);

    getCityInfo(searchTerm,"");

    $("#searchTerm").val("");
});

// when enter is pressed, get search term and run the functions
$("#searchTerm").on("keyup", function(event){
    if (event.key==="Enter"){
        var searchTerm = getSearchTerm();
        $("#citySearched").text(searchTerm);
        getCityInfo(searchTerm,"");

        putSearchTermOnPage(searchTerm);
        $("#searchTerm").val("");
    } else {
        var searchTerm = getSearchTerm();
        $("#autofillResults").empty();
        getAutocompleteResults(searchTerm);
        // run autocomplete function
    }

});

// Function to clean up and validate search term.
function getSearchTerm() {
    // get value from input box
    var searchTerm = $("#searchTerm").val().trim();
    // call function to validate if there are special characters
    var isValid = inputValidation(searchTerm);
    if (isValid) {
        // if it's valid, capitalize the first letter of every word
        searchTerm = capitalizeFirstLetterEachWordSplitBySpace(searchTerm);
        currentSearchTerm = searchTerm;
    } else {
        // if it's not valid, update page to say it's not a valid string
        console.log(searchTerm + " is not a valid string");
        $("#YourElementHere").html("no special characters");
    }
    return searchTerm;
}

// function to update the page
function getCityInfo(searchTerm){
    // hide activities and restaurants box, only show overview
    $("#overviewBox").show();
    $("#activitiesBox").hide();
    $("#restaurantsBox").hide();


    // push searchTerm to firebase if it doesnt exist already
    var cityRef = ref.child(searchTerm);
    console.log(cityRef);
    cityRef.once("value", function(snapshot) {
        if (snapshot.val() === null) {
            db.ref().push({ "searchTerm": searchTerm })
        } else {
            // if it already exists, don't push to db
        }
        localStorage.setItem("city1",searchTerm);
    });

    // call function to empty previous results
    clearBoxes();
    // initialize map
    sbgoogleObj.mapDestinationElem = document.getElementById('map');
    sbgoogleObj.initialize();
    sbgoogleObj.getLocation(searchTerm);
    //sbgoogleObj.getPlaces();
    // call weather API
    callWeather(searchTerm);
}

// function to put database on page
function putSearchTermOnPage(searchTerm) {
    // Create divs to update recent searches
    var newSearchTerm = $("<div>").html(searchTerm);
    newSearchTerm.addClass("searchHistoryTerms btn");

    newSearchTerm.attr("data-term",searchTerm);

    // update list on html page
    $("#recentSearches").append(newSearchTerm);
}
// function to check if searchTerm is already in Firebase
function checkFirebaseForSearchTerm(searchTerm) {
    ref.once("value")
        .then(function(snapshot) {
            var checkCounter = 0;
            snapshot.forEach(function(childSnapshot) {
                var cityName = childSnapshot.val().searchTerm;
                if (cityName === searchTerm) {
                    checkCounter++;
                };
            });
        });
    console.log(checkCounter)
    return checkCounter;
}

// function to empty previous results

function clearBoxes(){
    $(".wrapper").empty();
    $("#weatherBox").empty();
    $("#activitiesResults").empty();
    $("#restaurantsResults").empty();
}

// function to capitalize first letter of each word
function capitalizeFirstLetterEachWordSplitBySpace(string) {
    var words = string.split(" ");
    var output = "";
    for (i = 0; i < words.length; i++) {
        // lowercase all letters, capitalize only the first letter
        lowerWord = words[i].toLowerCase();
        lowerWord = lowerWord.trim();
        capitalizedWord = lowerWord.slice(0, 1).toUpperCase() + lowerWord.slice(1);
        output += capitalizedWord;
        // add space to end fo capitalizedWord if not last word
        if (i != words.length - 1) {
            output += " ";
        }
    } //for
    output[output.length - 1] = '';
    return output;
}

// When overview nav link is clicked,
// show the overview div and hide others
$("#overviewTab").on("click", function() {
    $("#overviewBox").show();
    $("#activitiesBox").hide();
    $("#restaurantsBox").hide();
    $(".navTabs").removeClass("active").addClass("inactive");
    $("#overviewTab").addClass("active").removeClass("inactive");
});
// When activities nav link is clicked,
// show the overview div and hide others
$("#activitiesTab").on("click", function() {
    $("#overviewBox").hide();
    $("#activitiesBox").show();
    $("#restaurantsBox").hide();
    $(".navTabs").removeClass("active").addClass("inactive");
    $("#activitiesTab").addClass("active").removeClass("inactive");
    sbgoogleObj.type = "things to do";
    sbgoogleObj.mapDestinationElem = document.getElementById("map2");
    sbgoogleObj.displayPlacesElem = $("#pointsOfInterest2")
    sbgoogleObj.initialize();
    sbgoogleObj.getLocation(currentSearchTerm);

});
// When restaurant nav link is clicked,
// show the overview div and hide others
$("#restaurantTab").on("click", function() {
    $("#overviewBox").hide();
    $("#activitiesBox").hide();
    $("#restaurantsBox").show();
    $(".navTabs").removeClass("active").addClass("inactive");
    $("#restaurantTab").addClass("active").removeClass("inactive");
    sbgoogleObj.type = "restaurant";
    sbgoogleObj.mapDestinationElem = document.getElementById("map3");
    sbgoogleObj.displayPlacesElem = $("#pointsOfInterest3");
    sbgoogleObj.initialize();
    sbgoogleObj.getLocation(currentSearchTerm);
});

function inputValidation(testString) {
    return true;
    //This function tests if the argument is alphanumeric and returns true or false accordingly
    return (testString == /^([0-9]|[a-z])+([0-9a-z]+)$/i) ? true : false;
}
