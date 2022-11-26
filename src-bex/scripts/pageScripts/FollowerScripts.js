export function executeScript() {
  console.log("executeScript...");
  chrome.action.enable();
  async function queryFollower() {
    return new Promise((resolve, _) => {
      chrome.runtime.sendMessage({Type: "refresh", initiative: true}, function (...data) {
        resolve(data);
      });
    });
  }

  async function main() {
    await chrome.action.enable();
    let target_vmid = /(?!\/)[0-9]+(?=\/)/.exec(location.pathname)[0];
    let userInformationUrl = "https://api.bilibili.com/x/web-interface/nav";
    let userInformation = await (await fetch(userInformationUrl)).json();
    let user_vmid = userInformation.data.mid;
    let url = `https://api.bilibili.com/x/relation/followers?vmid=${user_vmid}&pn=1&ps=50&order=desc&order_type=attention`;
    let data = await queryFollower();
  }

  main().then(() => null);
}
