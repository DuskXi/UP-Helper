async function readStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.get(key, function (result) {
      resolve(result[key]);
    });
  });
}

async function writeStorage(key, value) {
  return new Promise(resolve => {
    chrome.storage.local.set({[key]: value}, function () {
      resolve();
    });
  });
}

async function deleteStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.remove(key, function () {
      resolve();
    });
  });
}

async function listStorage() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, function (result) {
      resolve(result);
    });
  });
}

async function listStorageKeys() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, function (result) {
      resolve(Object.keys(result));
    });
  });
}

export {
  readStorage, writeStorage, deleteStorage, listStorage, listStorageKeys,
}
