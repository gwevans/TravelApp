// function to get the autocomplete results from google places API
function getAutocompleteResults(searchTerm) {
    var limit = 5; // amount of autofill results to show
    var queryObject = {
        input: searchTerm,
    };
    queryObject = $.param(queryObject);
    queryURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryObject + "&types=(cities)&key=AIzaSyBGNcO9R09tP2wolVLwVHGsVVNhtSUbDHQ";

    $.ajax({
        method: "POST",
        dataType: "json",
        url: "https://proxy-cbc.herokuapp.com/proxy",
        data: {
            url: queryURL
        }

    }).done(function(response) {
        var cityArray = [];
        for (i = 0; i < limit; i++) {
            if (response.data.predictions[i]) {
                cityName = response.data.predictions[i].structured_formatting.main_text;
                var newAutoFillDiv = $("<div>");
                newAutoFillDiv.text(cityName)
                newAutoFillDiv.attr("data-term", cityName);
                newAutoFillDiv.addClass("dropDownItems");
                cityArray[i] = cityName;
            }
        }
        console.log(cityArray);
        var uniqueCity = [];
        $.each(cityArray, function (i,el){
            if($.inArray(el,uniqueCity) === -1) uniqueCity.push(el)
        });
        console.log(uniqueCity);
        $("#searchTerm").autocomplete({
            source: uniqueCity
        });
    });
}
