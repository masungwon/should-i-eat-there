// get business name
const restaurant_name_element = document
  .getElementsByClassName("biz-page-title")
  .item(0);
const restaurant_name = restaurant_name_element.textContent.trim();

chrome.storage.sync.set({ restaurant_name }, function() {
  console.log(`set restaurant_name in storage to: ${restaurant_name}`);
});
