export function executeScript() {
  console.log("Executing script...");

  function getQueryVariable(name) {
    const url = decodeURI(location.search);
    let query = {};
    if (url.indexOf("?") !== -1) {
      let str = url.substr(1);
      if (str.indexOf("#") !== -1) str = str.substr(0, str.indexOf("#"));
      const pairs = str.split("&");
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        if (pair[0] === name) return pair[1];
      }
    }
    return null;
  }

  function chineseToNumber(text) {
    if (text.includes("万")) {
      let numberText = /[0-9\.]+(?=万)/.exec(text)
      return parseFloat(numberText) * 10000;
    } else {
      return parseInt(text);
    }
  }

  function getInfo(element) {
    let a = element.querySelector("a.cover-wrp");
    let href = a.getAttribute("href");
    let BV = /(?<=\/)[0-9a-zA-Z]+(?=\/$)/.exec(href)[0];
    let image = element.querySelector("img");
    let title = image.getAttribute("alt");
    let play = element.querySelector("div[title=播放]").querySelector("span").innerHTML;
    let dataHref = element.querySelectorAll("a.bili-btn")[1].getAttribute("href");
    let dataBV = /(?<=\/)[0-9a-zA-Z]+$/.exec(dataHref)[0];
    return {BV: BV, dataBV: dataBV, title: title, play: chineseToNumber(play)};
  }

  async function loadVideos(videoDetail) {
    let docs = document.querySelectorAll("div.article-card.clearfix.v2");

    let result = [];
    docs.forEach(element => {
      try {
        let container = element.querySelector("div.meta-footer.clearfix");
        if (container.childNodes.length > 7) {
          return;
        }
        let info = getInfo(element);
        let play = parseInt(videoDetail.data["arc_audits"].find(item => item["Archive"]["bvid"] === info.BV)["stat"].view);
        let comment = parseInt(container.querySelector("div.comment.view-stat").querySelector("span").innerHTML);
        let coin = parseInt(container.querySelector("div.coin.view-stat").querySelector("span").innerHTML);
        let favorite = parseInt(container.querySelector("div.favorite.view-stat").querySelector("span").innerHTML);
        let like = parseInt(videoDetail.data["arc_audits"].find(item => item["Archive"]["bvid"] === info.BV)["stat"]["like"]);
        let commentRate = play === 0 ? 0 : (100 * comment / play).toFixed(2);
        let coinRate = play === 0 ? 0 : (100 * coin / play).toFixed(2);
        let favoriteRate = play === 0 ? 0 : (100 * favorite / play).toFixed(2);
        let likeRate = play === 0 ? 0 : (100 * like / play).toFixed(2);
        let content = "<br/ >";
        content += `<div title="评论率" class="view-stat"><i class="bcc-iconfont bcc-icon-icon_commentx"></i><span class="icon-text">${commentRate}%</span></div>`;
        content += `<div title="投币率" class="view-stat"><i class="bcc-iconfont bcc-icon-icon_action_reward_n_x"></i><span class="icon-text">${coinRate}%</span></div>`;
        content += `<div title="收藏率" class="view-stat"><i class="bcc-iconfont bcc-icon-icon_action_collection_n_x"></i><span class="icon-text">${favoriteRate}%</span></div>`;
        content += `<div title="点赞率" class="view-stat"><i class="bcc-iconfont bcc-icon-icon_action_recommend_p_"></i><span class="icon-text">${likeRate}%</span></div>`;
        container.innerHTML += content;
        result.push(info);
      } catch (e) {

      }
    });

    return result;
  }

  async function sleep(amount) {
    return new Promise(resolve => {
      setTimeout(resolve, amount);
    });
  }

  async function waitLoaded(key, timeout = 10000) {
    let start = Date.now();
    while (true) {
      let element = document.querySelector(key);
      if (element) return element;
      if (Date.now() - start > timeout) return null;
      await sleep(100);
    }
  }


  async function getDiff(videos, videoDetail) {
    let data = [];
    let detailBuffer = await getDetailBuffer();
    let tasks = [];
    for (let i = 0; i < videos.length; i++) {
      tasks.push((async () => {
        let element = videos[i]
        let response = await fetch(`https://member.bilibili.com/x/web/data/v2/archive/analyze/stat?bvid=${element.dataBV}&t=${new Date().getTime()}`);
        let json = await response.json();
        let currentPlay = parseInt(videoDetail.data["arc_audits"].find(item => item["Archive"]["bvid"] === element.BV)["stat"].view);
        let content = `<div title="今日播放量" class="view-stat"><i class="bcc-iconfont bcc-icon-ic_Playbackx"></i>`
        let playToday = json.data.stat !== null ? currentPlay - json.data.stat.play : currentPlay;
        let buffered = Object.keys(detailBuffer).includes(element.BV) ? detailBuffer[element.BV] : {playToday: playToday};
        if (playToday - buffered.playToday < 0) {
          buffered.playToday = 0;
        }
        content += `<span class="icon-text">今日播放量: ${playToday}(+${playToday - buffered.playToday})</span></div>`;
        data.push({BV: element.BV, dataBV: element.dataBV, lastPlay: json.data.stat !== null ? json.data.stat.play : 0, currentPlay: element.play})
        let base = document.querySelector(`a[href='//www.bilibili.com/video/${element.BV}/']`).parentElement.querySelector("div.meta-footer.clearfix");
        base.innerHTML += content;
        let playHTML = `<div title="" class="view-stat"><i class="bcc-iconfont bcc-icon-ic_Playbackx"></i><span class="icon-text">${currentPlay >= 10000 ? (currentPlay / 10000.0) + " 万" : currentPlay}</span></div>`;
        let anchorPoint = base.querySelector("br");
        anchorPoint.insertAdjacentHTML("afterend", playHTML);
        // base.insertBefore(base.querySelector("div.view-stat"), anchorPoint);
        return {BV: element.BV, playToday: playToday};
      })());
    }
    let details = await Promise.all(tasks);
    for (let i = 0; i < details.length; i++) {
      await updateDetailBuffer(details[i]["BV"], {playToday: details[i]["playToday"]});
    }
    console.log(data)
  }

  async function queryStorage(key) {
    return new Promise((resolve, _) => {
      chrome.storage.local.get(key, result => {
        resolve(result[key]);
      });
    });
  }

  async function setStorage(key, value) {
    return new Promise(resolve => {
      chrome.storage.local.set({[key]: value}, () => {
        resolve();
      });
    });
  }

  async function getDetailBuffer() {
    let detail = await queryStorage("videosDetail");
    if (detail === null) {
      detail = {};
    }
    return detail;
  }

  async function updateDetailBuffer(bvid, stat) {
    let detail = await getDetailBuffer();
    detail[bvid] = stat;
    await setStorage("videosDetail", detail);
  }

  async function main() {
    let page = getQueryVariable("page");
    let videoDetailUrl = `https://member.bilibili.com/x/web/archives?status=is_pubing%2Cpubed%2Cnot_pubed&pn=${page ? page : 1}&ps=10&coop=1&interactive=1`;
    let responseWaiting = fetch(videoDetailUrl);
    await waitLoaded("div.article-card.clearfix.v2");
    let videoDetail = await (await responseWaiting).json();
    let result = await loadVideos(videoDetail);
    await getDiff(result, videoDetail);
  }

  main().then(() => null);
}
