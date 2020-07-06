$(document).ready(function () {
    $(".parallax").parallax();
});


// datepicker initialize 
$(document).ready(function () {
    $(".datepicker").datepicker({
        autoClose: true,
        minDate: new Date(),
        format: "yyyy-mm-dd"
    });
});

$(document).ready(function () {
    $(".collapsible").collapsible();
});


// setting global variables
var startingLocation = "";
var endingLocation = "";
var outboundDate = "";
var inboundDate = "";
var savedTripsArray = [];

// Display intro modal on load
$(document).ready(function () {
    $('#modal').modal();
    $('#modal').modal('open');
});

// get User Input when search is submitted

$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    // save user inputs to variables
    startingLocation = $(".from-city").val().trim()
    endingLocation = $(".to-city").val().trim()
    outboundDate = $("#outbound-date").val().trim()
    inboundDate = $("#inbound-date").val().trim()

    // check for empty inputs
    if (startingLocation === "" || endingLocation === "") {
        M.toast({ html: 'Please select your locations' })
    }
    if (outboundDate === "" || inboundDate === "") {
        M.toast({ html: 'Please select your dates' })
    }
    if (inboundDate < outboundDate) {
        M.toast({ html: 'Inbound date must be after outbound date' })
    }
    if ((startingLocation != "") &
        (endingLocation != "") &
        (outboundDate != "") &
        (inboundDate != "") &
        (inboundDate > outboundDate)) {
        getTravelAdvice();
        getTravelQuotes();
    }

    

})


// fetch call for COVID Data
var getTravelAdvice = function () {

    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    // adds user inputs into fetch call
    fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    addCountryData(data);
                });
            }
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Unable to connect and gather COVID-19 data' })
        })
}

// load fetched data to page
function addCountryData(data) {
    // stop hiding data cards on right side of page
    $("div").removeClass("hide");

    var newDiv = $("<div>").addClass("card-content white-text");
    var cityTitle = $("<h2>").addClass("card-title").text(data.Trips[0].To + " " + new Date(data.Trips[0].Date).toISOString().split('T')[0]);

    // get note URL
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var input = data.Trips[0].Advice.Notes[0].Note;
    var url = input.match(urlRegex)[1];
    var note = input.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

    var newCases = $("<p>").text("New Cases: " + data.Trips[0].LatestStats.new_cases);
    var totalCases = $("<p>").text("Total Cases: " + data.Trips[0].LatestStats.total_cases);
    var newDeaths = $("<p>").text("New Deaths: " + data.Trips[0].LatestStats.new_deaths);
    var totalDeaths = $("<p>").text("Total Deaths: " + data.Trips[0].LatestStats.total_deaths);
    var restrictionLevel = $("<p>").text("Restriction Level: " + data.Trips[0].Advice.News.Recommendation);
    var notesContainer = $("<p>");
    var restrictionNotes = $("<span>").text("Notes: " + note);
    var restrictionURL = $("<a />").text("More information >").attr("href", url).attr("target", "_blank");
    var lastUpdated = $("<p>").text("Last Updated: " + new Date(data.Trips[0].LatestStats.date).toISOString().split('T')[0]);

    notesContainer.append(restrictionNotes, restrictionURL);
    $("#covid-data").html(newDiv.append(cityTitle).append(newCases, totalCases, newDeaths, totalDeaths, restrictionLevel, notesContainer, lastUpdated));
}

// fetch call for flight options
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
                    getTravelOptions(data);
                });
            };
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Unable to connect and gather flight routes' })
        })
};

// load flight options to page
function getTravelOptions(data) {
    // override previous search
    $("#flight-options").text("")
    // loop through all carriers
    for (var i = 0; i < data.Carriers.length; i++) {
        console.log(data.Carriers[i].Name + ' flight price options:')
        // card title
        var newCard = $("<div>").addClass("card card-content blue3 white-text");
        var cardTitle = $("<span>").addClass("card-title").text(data.Carriers[i].Name);

        // card table
        var addRow = $("<div>").addClass("row")
        var table = $("<table>").addClass("centered highlight blue3");
        var thead = $("<thead>").attr('id', 'thead');
        var trhead = $("<trhead>").attr('id', 'trhead');
        var priceTitle = $("<th>").addClass("centered").text("Price");
        var directTitle = $("<th>").text("Direct flight");

        table.append(thead.append(trhead.append(priceTitle, directTitle)));
        addRow.append(table)

        newCard.append(cardTitle, addRow);
        $("#flight-options").append(newCard);

        var priceList = [];
        // loop through all quotes
        for (var j = 0; j < data.Quotes.length; j++) {
            // check for same carrier id
            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                // if price is not repeated
                if (!priceList.includes(data.Quotes[j].MinPrice)) {
                    priceList.push(data.Quotes[j].MinPrice)
                    console.log("$" + data.Quotes[j].MinPrice + " Direct: " + data.Quotes[j].Direct)
                    // add prices and direct flight to table
                    var tbody = $("<tbody>").attr('id', 'tbody');
                    var trbody = $("<tr>").attr('id', 'trbody');
                    var flightPrice = $("<td>").text("$" + data.Quotes[j].MinPrice);
                    var directFlight = $("<td>").attr('id', 'directFlight');
                    if (data.Quotes[j].Direct === true) {
                        directFlight.text("Yes");
                    } else {
                        directFlight.text("No");
                    }
                }

                table.append(tbody.append(trbody.append(flightPrice, directFlight)));
            }
        }
    }

}

// add trip to saved trips sidebar on click
$("#add-trip-btn").on("click", function() {
    $("div").removeClass("hide");

    var savedTripLi = $("<li>")
    var fixedOutboundDate = new Date(outboundDate).toISOString().split('T')[0];
    var fixedInboundDate = new Date(inboundDate).toISOString().split('T')[0];

    var savedTripLink = $("<a>").attr("href", "#").text(startingLocation + " - " + endingLocation + "  (" +  fixedOutboundDate + " - " + fixedInboundDate + ") ");
    
    // save to saved trip info to an object
    var savedTripObj = {
        outboundCity: startingLocation,
        inboundCity: endingLocation,
        outboundDate: fixedOutboundDate,
        inboundDate: fixedInboundDate
    }
    // push that to savedTripsArray 
    savedTripsArray.push(savedTripObj);

    // save to local storage 
    localStorage.setItem("savedTrips", JSON.stringify(savedTripsArray));

    // append saved trip to page
    savedTripLi.append(savedTripLink);
    $(".saved-trips-list").append(savedTripLi);
    
})

// will load previously saved Trips to page
var loadSavedTrips = function () {
    // pull from local storage
    var savedTrips = JSON.parse(localStorage.getItem("savedTrips"));

    if (!savedTrips) {
        $(".saved-trips-list").html("");
        return;
    } else {    
        // push to saved trips array 
        savedTripsArray = savedTrips;
        console.log(savedTripsArray);
        // create list element for each obj within saved Trips array
        for (var i=0; i < savedTrips.length; i++) {
            var savedTripLi = $("<li>")
            var savedTripLink = $("<a>").attr("href", "#").text(savedTrips[i].outboundCity + "-" + savedTrips[i].inboundCity + " " +  savedTrips[i].outboundDate + "-" + savedTrips[i].inboundDate);
            
            // append saved trip to page
            savedTripLi.append(savedTripLink);
            $(".saved-trips-list").append(savedTripLi);
        }
    }
}

// on button click, saved trips will be cleared
$("#clear-trips-btn").on('click', function () {
    localStorage.removeItem("savedTrips");
    loadSavedTrips();
})

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



// getTravelAdvice();
// getTravelQuotes();
// getUrlQuotes();
loadSavedTrips();

