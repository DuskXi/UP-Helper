import {bexBackground} from 'quasar/wrappers'
import {run} from './initialize'

run();

console.log('Background script has been loaded!')

chrome.runtime.onInstalled.addListener(() => {

  chrome.contextMenus.create(
    {
      "title": "视频搜索排名", "contexts": ["page"], id: "test"
    });

  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (tab.url.startsWith("https://member.bilibili.com/platform/upload-manager/article"))
    chrome.tabs.create({url: chrome.runtime.getURL('www/index.html#/VideoSortPage')}).then(r => null);
  });

  chrome.contextMenus.create(
    {
      "title": "设置", "contexts": ["action"], id: "setting"
    });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "setting") {
        chrome.tabs.create({url: chrome.runtime.getURL('www/index.html#/')}).then(r => null);
    }
  });

  chrome.action.onClicked.addListener((/* tab */) => {
    // Opens our extension in a new browser window.
    // Only if a popup isn't defined in the manifest.
    chrome.tabs.create({
      url: chrome.runtime.getURL('www/index.html')
    }, (/* newTab */) => {
      // Tab opened.
    })
  })
})

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on('log', ({data, respond}) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []))
    respond()
  })

  bridge.on('getTime', ({respond}) => {
    respond(Date.now())
  })

  bridge.on('storage.get', ({data, respond}) => {
    const {key} = data
    if (key === null) {
      chrome.storage.local.get(null, items => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items))
      })
    } else {
      chrome.storage.local.get([key], items => {
        respond(items[key])
      })
    }
  })
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({data, respond}) => {
    chrome.storage.local.set({[data.key]: data.value}, () => {
      respond()
    })
  })
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  bridge.on('storage.remove', ({data, respond}) => {
    chrome.storage.local.remove(data.key, () => {
      respond()
    })
  })
  // Usage:
  // await bridge.send('storage.remove', { key: 'someKey' })

  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
})
