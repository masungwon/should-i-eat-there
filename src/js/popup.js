/**
 * customizes the browser
 * this content script is invoked inside of <script> tags in popup.html
 * (see popup.html file in build directory)
 *
 * To see console.logs added in this file,
 * open the popup in the UI, right click the element
 * and click "inspect."
 */

import { getInspectionData } from "./api.js";
import { getFromStoragePromisified } from "./utils.js";

popup();

async function popup() {
  try {
    const data = await getFromStoragePromisified(["restaurant_name"]);
    const response = await getInspectionData(data.restaurant_name);
    const grade = getGrade(response);
    addToPage(grade);
  } catch (error) {
    console.error(error);
  }
}

function getGrade(response) {
  let grade = "N/A";
  const is_grade_available = response.length && response[0].grade;
  if (is_grade_available) {
    grade = response[0].grade;
  }
  return grade;
}

function addToPage(data) {
  let container = document.getElementById("inspectionResult");
  const h1 = document.createElement("h1");
  const inspectionResult = document.createTextNode(data);
  h1.appendChild(inspectionResult);
  container.appendChild(h1);
}
