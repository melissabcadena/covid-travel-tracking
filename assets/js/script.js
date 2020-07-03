// Starting and Ending Locations should be Airport Codes
var startingLocation = "DFW";
var endingLocation = "LHR";
// Dates should be in the format below from the calendar input
var outboundDate = "2020-07-06";
var inboundDate = "2020-07-15";

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
                    var totalPopulation = data.Trips[0].LatestStats.population;
                    console.log(totalPopulation);
                    // Console for the New Cases
                    var newCases = data.Trips[0].LatestStats.new_cases;
                    console.log(newCases + " New Cases");
                    // Console for New Cases as a % of Total Population
                    // console.log((newCases/totalPopulation) * 100 + "%");
                    // Console for the Total Cases
                    var totalCases = data.Trips[0].LatestStats.total_cases;
                    console.log(totalCases + " Total Cases");
                    // Console for Total Cases as a % of Total Population
                    // console.log((totalCases/totalPopulation) * 100 + "%");
                    // Console for the New Deaths
                    var newDeaths = data.Trips[0].LatestStats.new_deaths;
                    console.log(newDeaths + " New Deaths");
                    // Console for New Deaths as a % of Total Population
                    //  console.log((newDeaths/totalPopulation) * 100 + "%");
                    // Console for the Total Deaths
                    var totalDeaths = data.Trips[0].LatestStats.total_deaths;
                    console.log(totalDeaths + " Total Deaths");
                    // Console for Total Deaths as a % of Total Population
                    // console.log((totalDeaths/totalPopulation) * 100 + "%");
                    // Console for the Restriction Level
                    console.log(data.Trips[0].Advice.News.Recommendation);
                    // Console for Notes for Restriction Level
                    console.log(data.Trips[0].Advice.Notes[0].Note);
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
                    console.log(data.Quotes[0].MinPrice);
                    console.log(data.Carriers[0].Name);
                });
            };
        });
};

// var getUrlQuotes = function () {
//     fetch("https://tripadvisor1.p.rapidapi.com/flights/create-session?currency=USD&ta=1&c=0&d1=CNX&o1=DMK&dd1=%3Crequired%3E", {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
//             "x-rapidapi-key": "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7"
//         }
//     })
//         .then(response => {
//             console.log(response);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

    //     var myHeaders = new Headers();
    //     myHeaders.append("x-rapidapi-host", "tripadvisor1.p.rapidapi.com","x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //     };

    //     fetch("https://tripadvisor1.p.rapidapi.com/?rapidapi-key=84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7/flights/create-session?currency=USD&ta=1&c=0&d1=" + endingLocation + "&o1=" + startingLocation + "&dd1=" + outboundDate, requestOptions)

    //             .then(function (response) {
    //                 if (response.ok) {
    //                     response.json().then(function (data) {
    //                         console.log(data);
    //                     });
    //                 };
    //             });
    // };

getTravelAdvice();
getTravelQuotes();
// getUrlQuotes();
