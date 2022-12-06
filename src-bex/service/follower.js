import {readStorage, writeStorage} from '../storage'
import {getCookieString, getCookies} from "app/src-bex/cookie";
import {registerMessageListener} from "app/src-bex/communication";

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

class Follower {
  constructor() {
    this.key = 'follower'
    this.uid = ""
    this.followers = []
    this.followersUidList = []
  }

  async init() {
    await this.loadUserInfo();
    await this.readFollowers();
    await this.registerListener();
  }

  async registerListener() {
    registerMessageListener("updateFollowers", async (request, sender, sendResponse) => {
      await this.updateFollowers();
      sendResponse({message: "success"});
    });

    registerMessageListener("getFollowers", async (request, sender, sendResponse) => {
      sendResponse({message: "success", data: this.followers});
    });

    registerMessageListener("isFollower", async (request, sender, sendResponse) => {
      let uid = request.data.uid;
      let isFollower = this.followersUidList.includes(uid);
      let index = isFollower ? this.followersUidList.indexOf(uid) : -1;
      sendResponse({message: "success", data: isFollower, index: index});
    });

    registerMessageListener("updateFollowers", async (request, sender, sendResponse) => {
      await this.updateFollowers();
      sendResponse({message: "success"});
    })
  }

  async loadUserInfo() {
    this.uid = await readStorage('uid')
    if (this.uid === undefined) {
      let cookies = await getCookies("bilibili.com");
      for (let cookie of cookies) {
        if (cookie.name === "DedeUserID") {
          this.uid = cookie.value;
          await writeStorage('uid', this.uid);
          break;
        }
      }
    }
    if (typeof this.uid === "string") {
      this.uid = parseInt(this.uid);
    }
  }

  async readFollowers() {
    this.followers = await readStorage(this.key)
    if (typeof this.followers === "undefined") {
      this.followers = []
    }
    this.followersUidList = this.followers.map(follower => follower.uid)
    return this.followers
  }

  async saveFollowers() {
    await writeStorage(this.key, this.followers)
  }

  async getFollowersNumber(cookie) {
    let url = `https://api.bilibili.com/x/relation/stat?vmid=${this.uid}`;
    let response = await fetch(url, {headers: {cookie: cookie}});
    let json = await response.json();
    return json.data["follower"]
  }

  async updateFollowers() {
    let cookieString = await getCookieString("bilibili.com");
    let headers = {cookie: cookieString};
    let followers = this.followers;
    let followersUidList = this.followersUidList;
    let breakFlag = 0;
    let index = 1;
    while (true) {
      breakFlag = 0;
      let url = `https://api.bilibili.com/x/relation/followers?vmid=${this.uid}&pn=${index}&ps=50&order=desc&order_type=attention`;
      let response = await fetch(url, {headers: headers});
      let json = await response.json();
      if (json.data.list.length > 0) {
        for (let follower of json.data.list) {
          let uid = follower["mid"];
          let userName = follower["uname"];
          if (!followersUidList.includes(uid)) {
            followers.push({uid: uid, userName: userName})
            followersUidList.push(uid)
          } else {
            breakFlag++;
          }
        }
        if (breakFlag > 2) {
          break;
        }
        index++;
        await sleep(1);
      } else {
        break;
      }
    }
    followersUidList = followers.map(follower => follower.uid)
    this.followers = followers;
    this.followersUidList = followersUidList;
    await this.saveFollowers();
  }
}

export {
  Follower
}
