// Starting and Ending Locations should be Airport Codes
var startingLocation = "DFW";
var endingLocation = "LHR";
// Dates should be in the format below from the calendar input
var outboundDate = "2020-07-06";
var inboundDate = "2020-07-15";

// Display intro modal on load
$(document).ready(function(){
    $('#modal').modal();
    $('#modal').modal('open'); 
});


var getTravelAdvice = function () {
    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    // var totalPopulation = data.Trips[0].LatestStats.population;
                    // console.log(totalPopulation);
                    // // Console for the New Cases
                    var newCases = $("<p>").text(data.Trips[0].LatestStats.new_cases + " New Cases");
                    // console.log(newCases + " New Cases");
                    // // Console for the Total Cases
                    // var totalCases = data.Trips[0].LatestStats.total_cases;
                    // console.log(totalCases + " Total Cases");
                    // // Console for the New Deaths
                    // var newDeaths = data.Trips[0].LatestStats.new_deaths;
                    // console.log(newDeaths + " New Deaths");
                    // // Console for the Total Deaths
                    // var totalDeaths = data.Trips[0].LatestStats.total_deaths;
                    // console.log(totalDeaths + " Total Deaths");
                    // // Console for the Restriction Level
                    // console.log(data.Trips[0].Advice.News.Recommendation);
                    // // Console for Notes for Restriction Level
                    // console.log(data.Trips[0].Advice.Notes[0].Note);


                });
            };
        });
}

var getTravelQuotes = function () {
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + startingLocation + "-sky/" + endingLocation + "-sky/" + outboundDate + "?inboundpartialdate=" + inboundDate, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    for (var i = 0; i < data.Carriers.length; i++) {
                        for (var j = 0; j < data.Quotes.length; j++) {
                            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                                console.log(data.Carriers[i].Name + " has a minimum price of $" + data.Quotes[j].MinPrice);
                            }
                        }
                    }
                });
            };
        });
};

// var getUrlQuotes = function () {

//     var myHeaders = new Headers();
//     myHeaders.append("x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

//     var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     fetch("https://tripadvisor1.p.rapidapi.com/flights/create-session?currency=USD&ta=1&c=0&d1=" + endingLocation + "&o1=" + startingLocation + "&dd1=" + outboundDate, requestOptions)
//         .then(function (response) {
//             if (response.ok) {
//                 response.json().then(function (data) {
//                     console.log(data);
//                 });
//             };
//         });
// }

getTravelAdvice();
getTravelQuotes();
// getUrlQuotes();