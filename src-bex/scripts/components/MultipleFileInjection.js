import {Component} from '../components';
import {executeScript as script1} from "../pageScripts/PlayPageScripts";
import {executeScript as script2} from "../pageScripts/MemberHomeScripts";
import {executeScript as script3} from "../pageScripts/CollectionScript";

export class MultipleFileInjection extends Component {
  /**
   * This method is called when the component is created.
   @param {TabManager} tabManager
   */
  constructor(tabManager) {
    super("VideoInformation");
    this.tabManager = tabManager;
    this.scriptMap = {
      "https://www.bilibili.com/video": script1,
      "https://member.bilibili.com/platform/home": script2,
      "https://member.bilibili.com/platform/upload-manager/ep": script3
    };
  }

  init() {
    super.init();
    this.tabManager.addListener(
      (tabId, changeInfo, tab) => this.onPageUrlChange(tabId, changeInfo, tab)
    );
  }

  destroy() {
    super.destroy();
  }

  matchUrl(urlStr) {
    let url = new URL(urlStr);
    for (let key in this.scriptMap) {
      let target = new URL(key);
      if (url.host === target.host && url.pathname.startsWith(target.pathname)) {
        return key;
      }
    }
    return null;
  }

  onPageUrlChange(tabId, changeInfo, tab) {
    let url = changeInfo.url ? changeInfo.url : tab.url;
    let urlMatched = this.matchUrl(url);
    if (urlMatched != null) {
      this.onMatchedUrl(tabId, changeInfo, urlMatched);
    }
  }

  onMatchedUrl(tabId, changeInfo, urlMatched) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: this.scriptMap[urlMatched],
    }).then(_ => null);
  }
}
