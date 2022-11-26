class Communication {
  constructor() {
  }

  registerMessageListener(key, callback) {
    chrome.runtime.onMessage.addListener(
      async function (request, sender, sendResponse) {
        if (request.message === key) {
          await callback(request, sender, sendResponse);
        }
      }
    );
  }
}

function registerMessageListener(key, callback) {
  chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
      if (request.message === key) {
        await callback(request, sender, sendResponse);
      }
    }
  );
}

export {
  Communication,
  registerMessageListener
}
