import {TabManager} from '../tab';
import {Component} from '../components';
import {executeScript} from "app/src-bex/scripts/pageScripts/VideosInformationScript";

export class VideoInformation extends Component {
  /**
   * This method is called when the component is created.
   @param {TabManager} tabManager
   */
  constructor(tabManager) {
    super("VideoInformation");
    this.tabManager = tabManager;
    this.host = "member.bilibili.com";
    this.route = "/platform/upload-manager/article";
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
    return url.host === this.host && url.pathname.startsWith(this.route);
  }

  onPageUrlChange(tabId, changeInfo, tab) {
    let url = changeInfo.url ? changeInfo.url : tab.url;
    if (this.matchUrl(url)) {
      this.onMatchedUrl(tabId, changeInfo);
    }
  }

  onMatchedUrl(tabId, changeInfo) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: executeScript,
    });
  }
}
