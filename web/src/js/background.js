// event handler; listens for browser events

// import images so that they get included in the webpack bundle
import "../images/get_started16.png";
import "../images/get_started32.png";
import "../images/get_started48.png";
import "../images/get_started128.png";

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // specify when the chrome extension should be clickable
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "www.yelp.com"
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
