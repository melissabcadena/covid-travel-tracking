var startingLocation = "BWI";
var endingLocation = "DFW";
var outboundDate = "2020-07-05";
var inboundDate = "2020-07-10";

var getTravelRestrictions = function () {
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
                    console.log(data.trips[0].advice);
                });
            };
        });
}

var getTravelRoutes = function () {
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com", "x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + startingLocation + "-sky/" + endingLocation + "-sky/" + outboundDate + "?inboundpartialdate=" + inboundDate, requestOptions) 
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            });
        };
    });
};

getTravelRestrictions();
getTravelRoutes();

        // "method": "GET",
        // "headers": {
        // 	"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        // 	"x-rapidapi-key": "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7"
//     }
// })
// .then(response => {
//     console.log(response);
// })
//     .catch(err => {
//         console.log(err);
//     });
// }

// Sample provided by API Owner below
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
