import {readStorage, writeStorage} from '../storage'
import {getCookieString, getCookies} from "app/src-bex/cookie";
import {registerMessageListener} from "app/src-bex/communication";

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

class DirectStorage {
  async init() {
    await this.registerListener();
  }

  async registerListener() {
    registerMessageListener("storageQuery", async (request, sender, sendResponse) => {
      let result = await readStorage(request.data.key);
      sendResponse({message: "success", data: result !== undefined ? result : null});
    });

    registerMessageListener("storageSet", async (request, sender, sendResponse) => {
      await writeStorage(request.data.key, request.data.value);
      sendResponse({message: "success"});
    });
  }
}


export {
  DirectStorage
}
