async function executeScript() {
  async function isFollower(uid) {
    return new Promise((resolve, _) => {
      chrome.runtime.sendMessage({message: "isFollower", data: {uid: uid}}, function (response) {
        if (response.message === "success") {
          resolve(response.data);
        }
      });
    });
  }

  async function updateFollowers() {
    return new Promise((resolve, _) => {
      chrome.runtime.sendMessage({message: "updateFollowers"}, function (response) {
        resolve();
      });
    });
  }

  console.log('executeScript...');
  let uid = parseInt(/(?<=\/)[0-9]+/.exec(window.location.pathname)[0]);
  let nav = await (await fetch("https://api.bilibili.com/x/web-interface/nav", {credentials: 'include'})).json();
  let userUid = nav.data.mid;
  if (userUid !== uid) {
    await updateFollowers();
    let is_follower = await isFollower(uid);
    if (is_follower) {
      console.log('is_follower');
      let container = document.querySelector('div.h-basic').querySelector('div');
      container.innerHTML += '<div style="display: inline-block; font-size:10px; vertical-align: middle; border-style: solid; border-radius: 4px; border-width: 2px; border-color: rgba(0,0,0,0);background-color: #FFC0CB;"><span style="margin: 2px">粉丝</span></div>'
    }
  }
}

export {
  executeScript
}
