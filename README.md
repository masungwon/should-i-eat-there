# What is this?

This is a chrome extension that displays health grades on Yelp's restaurant pages. I created this hackathon-style project to learn about chrome extensions.

The restaurant inspection results come from [NYC Open Data](https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j). It was built off of [Chrome-extension-react-boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate).

# To run it locally

1. Clone the repository.
2. `cd` into `web` directory.
3. Run `yarn`.
4. Run `npm run start`.
5. Load your extension on Chrome:
   1. Access chrome://extensions/
   2. Check Developer mode
   3. Click on Load unpacked extension
   4. Select the build folder.
6. Go to a Yelp restaurant page, such as [this one](https://www.yelp.com/biz/bunsmith-brooklyn).
7. Click on the chrome extension icon on the top right corner. It should show a health grade for this particular restaurant.
