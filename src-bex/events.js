function registerPageMonitor(callback) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete')
      callback(tabId, changeInfo, tab);
  });
}

export {
  registerPageMonitor
};
