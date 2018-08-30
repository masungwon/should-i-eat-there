function getFromStoragePromisified(param) {
  return new Promise(resolve => {
    chrome.storage.sync.get(param, items => {
      resolve(items);
    });
  });
}

module.exports = {
  getFromStoragePromisified
};
