import {Component} from '../components';
import {executeScript} from "app/src-bex/scripts/pageScripts/SpaceScripts";

export class Space extends Component {
  constructor(tabManager) {
    super("Space");
    this.tabManager = tabManager;
    this.host = "space.bilibili.com";
    this.route = "/[0-9]+";
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
    return url.host === this.host && url.pathname.match(this.route);
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
    }).then(r => null);
  }
}
