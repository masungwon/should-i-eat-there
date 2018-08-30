// TODO: Make the query more location-specific
// ex: there are multiple Starbucks locations

// TODO: I need to better handle if multiple yelp pages are open
// (make sure the popup page and the current tab always match)

async function getInspectionData(restaurant_name) {
  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$q=${restaurant_name}&$order=inspection_date DESC`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );
    return response.json();
  } catch (error) {
    console.log("Something went wrong on api server!");
    console.log(error);
  }
}

module.exports = {
  getInspectionData
};
