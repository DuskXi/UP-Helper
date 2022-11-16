export function executeScript() {
  console.log("executeScript...");
  let vmid = /(?!\/)[0-9]+(?=\/)/.exec(location.pathname)[0];
  let url = `https://api.bilibili.com/x/relation/followers?vmid=${vmid}&pn=1&ps=50&order=desc&order_type=attention`;
}
