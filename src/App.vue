<template>
  <div>
    <ShareContent :info="info" />
    <!-- <ShareIndex :info="info"/> -->
  </div>
</template>

<script>
// import ShareIndex from './package/share-content.vue'
export default {
  name: 'App',
  data() {
    return {
      info: {
        url: 'https://m.ourplay.net/rank/detail/120137',
        title: '原神（国服）',
        summary: `在七种元素交汇的大陆——「提瓦特」，每个人都可以成为神。`,
        titleimg: 'https://cdn.ourplay.net/xspace/games/1692194268623350.jpg',
        desc: '在七种元素交汇的大陆——「提瓦特」，每个人都可以成为神。',
        site: '在七种元素交汇的大陆——「提瓦特」，每个人都可以成为神。',
        size: 120, // 二维码的大小
        margin: 0, //二维码的外边距
      },
    }
  },
  // components: {
  //   ShareIndex
  // }
}
</script>

<style>
</style>
