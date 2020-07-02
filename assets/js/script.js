var startingLocation = "DFW";
var endingLocation = "BWI";

var myHeaders = new Headers();
myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

console.log(requestOptions);
console.log(myHeaders);

fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation, requestOptions)
.then(function(response) {
    if(response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data.trips[0].advice);
        });
    };
});


// Sample provided by API Owner below
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
