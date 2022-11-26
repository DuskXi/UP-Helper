export function executeScript() {
  console.log('executeScript...');

  async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async function waitLoaded() {
    let loaded = false;
    while (!loaded) {
      await sleep(1);
      loaded = document.querySelector("div.section-row.bcc-row.first");
    }
  }

  function toString(number) {
    if (number < 10000) {
      return number.toString();
    } else {
      return (number / 10000).toFixed(1) + "w";
    }
  }

  async function getYesterdayFans() {
    let url = `https://member.bilibili.com/x/web/data/v2/fans/stat/num?period=0&t=${new Date().getTime()}`;
    let response = await fetch(url, {credentials: 'include'});
    let json = await response.json();
    return json.data["all_fans"];
  }

  async function getAllVideos() {
    let page = 1;
    let url = `https://member.bilibili.com/x/web/archives?status=is_pubing%2Cpubed%2Cnot_pubed&pn=${page}&ps=10&coop=1&interactive=1`;
    let response = await fetch(url, {credentials: 'include'});
    let json = await response.json();
    let total = json.data.page.count;
    let totalPages = Math.ceil(total / 10.0);
    let videos = json.data["arc_audits"];
    let requests = [];
    for (let i = 2; i <= totalPages; i++) {
      url = `https://member.bilibili.com/x/web/archives?status=is_pubing%2Cpubed%2Cnot_pubed&pn=${i}&ps=10&coop=1&interactive=1`;
      requests.push(fetch(url, {credentials: 'include'}));
    }
    let responses = await Promise.all(requests);
    for (let response of responses) {
      json = await response.json();
      videos = videos.concat(json.data["arc_audits"]);
    }
    return videos;
  }

  async function countTotalPlay() {
    let videos = await getAllVideos();
    let totalPlay = 0;
    for (let i = 0; i < videos.length; i++) {
      let element = videos[i];
      totalPlay += element["stat"].view;
    }
    return totalPlay;
  }

  async function getLikes() {
    let nav = await (await fetch("https://api.bilibili.com/x/web-interface/nav", {credentials: 'include'})).json();
    let userUid = nav.data.mid;
    let response = await fetch(`https://api.bilibili.com/x/space/upstat?mid=${userUid}`, {credentials: 'include'});
    let json = await response.json();
    return json.data['likes'];
  }

  async function main() {
    await waitLoaded();
    let container = document.querySelector("div.section-row.bcc-row.first");
    let container2 = document.querySelectorAll("div.section-row.bcc-row")[1];
    let stat = await (await fetch("https://member.bilibili.com/x/web/index/stat", {credentials: 'include'})).json();

    let fansExec = (async () => {
      let yesterdayFans = await getYesterdayFans();
      let fansElement = container.children[0].querySelector("div.value span");
      let currentFans = stat.data['total_fans'];
      let fansDiff = currentFans - yesterdayFans;
      fansElement.innerHTML += `(+${fansDiff})`
    })();

    let playExec = (async () => {
      let totalPlay = await countTotalPlay();
      let playElement = container.children[1].querySelector("div.value span");
      let yesterdayPlay = stat.data['total_click'];
      playElement.innerHTML += `(+${toString(totalPlay - yesterdayPlay)})`;
    })();

    let likeExec = (async () => {
      let totalLike = await getLikes();
      let likeElement = container2.children[0].querySelector("div.value span");
      let yesterdayLike = stat.data['total_like'];
      likeElement.innerHTML += `(+${toString(totalLike - yesterdayLike)})`;
    })();

    await Promise.all([fansExec, playExec, likeExec]);
  }

  main().then(() => console.log('executeScript done.'));
}
