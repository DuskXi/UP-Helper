import {registerPageMonitor} from '../events'

class TabManager {
  constructor() {
    this.listeners = [];
    this.registerPageMonitor();
  }

  addListener(callback) {
    this.listeners.push({function: callback, registered: true});
  }

  registerPageMonitor() {
    registerPageMonitor((tabId, changeInfo, tab) => this.onPageUrlChange(tabId, changeInfo, tab));
  }

  onPageUrlChange(tabId, changeInfo, tab) {
    this.listeners.forEach(listener => {
      if (listener.registered) {
        listener.function(tabId, changeInfo, tab);
      }
    });
  }
}

export {TabManager};

