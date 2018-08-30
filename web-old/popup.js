/**
 * To see console.logs added in this file,
 * open the popup in the UI, right click the element
 * and click "inspect."
 */

// customizes the BROWSER
// content script (invoked inside of <script> tags in popup.html)

// runs immediately
chrome.storage.sync.get(["restaurant_name"], function(data) {
  const restaurant_name = data.restaurant_name;
  getInspectionData(restaurant_name);
});

// TODO: I need to better handle if multiple yelp pages are open
// (I should make sure that whatever result you see reflects the actual business page)
function getInspectionData(restaurant_name) {
  return fetch(
    `https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$q=${restaurant_name}&$order=inspection_date DESC`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  )
    .then(response => {
      if (response.status === 200) {
        console.log("status is 200");
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then(response => {
      let grade = "N/A";
      const is_grade_available = response.length && response[0].grade;
      if (is_grade_available) {
        grade = response[0].grade;
      }
      addToPage(grade);
    })
    .catch(error => {
      console.error(error);
    });
}

function addToPage(data) {
  let container = document.getElementById("inspectionResult");
  const h1 = document.createElement("h1");
  const inspectionResult = document.createTextNode(data);
  h1.appendChild(inspectionResult);
  container.appendChild(h1);
}
