$(document).ready(function(){
    $(".parallax").parallax();
  });


// datepicker initialize 
$(document).ready(function() {
    $(".datepicker").datepicker({
      autoClose: true,
      minDate: new Date(),
      format: "yyyy-mm-dd"    
    });
  });

$(document).ready(function(){
    $(".collapsible").collapsible();
  });


// Starting and Ending Locations should be Airport Codes
var startingLocation = "";
var endingLocation = "";
// Dates should be in the format below from the calendar input
var outboundDate = "";
var inboundDate = "";

// Display intro modal on load
$(document).ready(function(){
    $('#modal').modal();
    $('#modal').modal('open'); 
});

// get User Input when search is submitted

$("#submit-btn").on("click", function(event) {
    event.preventDefault();

    // save user inputs to variables
    startingLocation = $(".from-city").val().trim()
    endingLocation = $(".to-city").val().trim()
    outboundDate = $("#outbound-date").val().trim()
    inboundDate = $("#inbound-date").val().trim()

    // check for empty inputs
    if(startingLocation === "" || endingLocation === "") {
        M.toast({html: 'Please select your locations'})
    }
    if(outboundDate === "" || inboundDate === "") {
        M.toast({html: 'Please select your dates'})
    }
    if(inboundDate < outboundDate){
        M.toast({html: 'Inbound date must be after outbound date'})
    }
    if( (startingLocation != "") &
        (endingLocation != "") &
        (outboundDate != "") &
        (inboundDate != "") &
        (inboundDate > outboundDate)) {
            getTravelAdvice();
            getTravelQuotes();
    }

    var googleFlightUrl = ("https://www.google.com/flights?hl=en#flt=" + startingLocation + "." + endingLocation + "." + outboundDate + "*" + endingLocation + "." + startingLocation + "." + inboundDate + ";c:USD;e:1;sd:1;t:f");
    console.log(googleFlightUrl);

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
                    // var totalPopulation = data.Trips[0].LatestStats.population;
                    // console.log(totalPopulation);
                    // // Console for the New Cases
                    // var newCases = $("<p>").addClass("new-button m-2 p-1").text(data.Trips[0].LatestStats.new_cases + " New Cases");
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

                    addCountryData(data);
                });
            }
        })
        .catch(function() {
            M.toast({html: 'ERROR: Unable to connect and gather COVID-19 data'})
        })
}

// load fetched data to page
function addCountryData (data) {
    // stop hiding data cards on right side of page
    $("div").removeClass("hide");

    var newDiv = $("<div>").addClass("card-content white-text");
    var cityTitle = $("<span>").addClass("card-title").text(data.Trips[0].To + " " + new Date(data.Trips[0].Date).toISOString().split('T')[0]);

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
    var restrictionURL = $("<a />").text("More information").attr("href", url).attr("target", "_blank");
    var lastUpdated = $("<p>").text("Last Updated: " + new Date(data.Trips[0].LatestStats.date).toISOString().split('T')[0]);
    
    notesContainer.append(restrictionNotes,restrictionURL);
    $("#covid-data").html(newDiv.append(cityTitle).append(newCases, totalCases, newDeaths, totalDeaths, restrictionLevel, notesContainer, lastUpdated));
}

// fetch call for flight routes
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
        .catch(function() {
            M.toast({html: 'ERROR: Unable to connect and gather flight routes'})
        })
};

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
        var priceTitle = $("<th>").text("Price");
        var directTitle = $("<th>").text("Direct flight");

        table.append(thead.append(trhead.append(priceTitle,directTitle)));
        addRow.append(table)

        newCard.append(cardTitle,addRow);
        $("#flight-options").append(newCard);

        var priceList = [];
        // loop through all quotes
        for (var j = 0; j < data.Quotes.length; j++) {
            // check for same carrier id
            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                // if price is not repeated
                if(!priceList.includes(data.Quotes[j].MinPrice)){
                    priceList.push(data.Quotes[j].MinPrice)
                    console.log("$" + data.Quotes[j].MinPrice + " Direct: " + data.Quotes[j].Direct)
                    // add prices and direct flight to table
                    var tbody = $("<tbody>").attr('id', 'tbody');
                    var trbody = $("<tr>").attr('id', 'trbody');
                    var flightPrice = $("<td>").text("$" + data.Quotes[j].MinPrice);
                    var directFlight = $("<td>").attr('id', 'directFlight');
                    if(data.Quotes[j].Direct === true) {
                        directFlight.text("Yes");
                    }else {
                        directFlight.text("No");
                    }
                }

                table.append(tbody.append(trbody.append(flightPrice,directFlight)));
            } 
        }
    }
    
}

// add trip to saved trips sidebar on click
$("#add-trip-btn").on("click", function() {
    var savedTripLi = $("<li>")
    var fixedOutboundDate = new Date(outboundDate).toISOString().split('T')[0];
    var fixedInboundDate = new Date(inboundDate).toISOString().split('T')[0];

    var savedTripLink = $("<a>").attr("href", "#").text(startingLocation + "-" + endingLocation + " " +  fixedOutboundDate + "-" + fixedInboundDate);
    
    savedTripLi.append(savedTripLink);
    $(".saved-trips-list").append(savedTripLi);
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

