<template>
  <q-page class="flex flex-left">
    <div class="q-pa-md" style="max-width: 1500px">
      <q-list bordered separator>
        <q-item class="q-pa-md" clickable v-ripple v-for="(video, index) in videos" :key="index">
          <q-item-section>
            <q-item-label>BV: {{ video["Archive"]["bvid"] }}</q-item-label>
            <q-item-label caption style="vertical-align: bottom;">
              <q-icon name="smart_display"/>
              <span> {{ video["stat"]["view"] }}</span>&nbsp;
              <q-icon name="thumb_up"/>
              <span>{{ video["stat"]["like"] }}</span>&nbsp;
              <q-icon name="star"/>
              <span>{{ video["stat"]["favorite"] }}</span>&nbsp;
              <span> 币{{ video["stat"]["favorite"] }}</span>
            </q-item-label>
          </q-item-section>
          <q-item-section thumbnail>
            <img :src="video['Archive']['cover']" alt="" style="margin-right: 20px"/>
          </q-item-section>

        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "VideoSortPage",
  data: () => {
    return {
      headers: {
        cookie: "",
      },
      videos: [],
      maxPages: 1,
    }
  },
  methods: {
    async syncAccountVideos(page = 1) {
      let url = `https://member.bilibili.com/x/web/archives?status=is_pubing%2Cpubed%2Cnot_pubed&pn=${page}&ps=10&coop=1&interactive=1`;
      let result = await fetch(url, {headers: this.headers});
      let json = await result.json();
      let totalVideos = json.data.page.count;
      let totalPages = Math.ceil(totalVideos / 10.0);
      let videos = [];
      for (let i = 0; i < totalPages; i++) {
        let url = `https://member.bilibili.com/x/web/archives?status=is_pubing%2Cpubed%2Cnot_pubed&pn=${page}&ps=10&coop=1&interactive=1`;
        let result = await fetch(url, {headers: this.headers});
        let json = await result.json();
        videos = videos.concat(json.data["arc_audits"]);
      }
      return [json.data["arc_audits"], totalPages];
    },
    async getCookies(domain) {
      return new Promise(resolve => {
        chrome.cookies.getAll({domain: domain}, function (cookies) {
          resolve(cookies);
        });
      });
    }
  },
  async mounted() {
    this.headers.cookie = await this.getCookies("bilibili.com");
    let firstPage = await this.syncAccountVideos();
    this.videos = firstPage[0];
    this.maxPages = firstPage[1];
  }
}
</script>

<style scoped>

</style>
