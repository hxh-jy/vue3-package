<template>
    <div 
    v-click-outside="shareToWechat" 
    class="share-content">
        <!-- 分享到微博 -->
        <img 
        class="share"
        @click="shareToMicroblog()"
        src="../assets/img/weibo.png" 
        alt="微博">
        <!-- 分享到qq -->
        <img 
        class="share"
        @click="shareToQQ()"
        src="../assets/img/qq.png" 
        alt="qq">

        <!-- 分享到qq空间 -->
        <img 
        class="share"
        @click="shareToQQRom()"
        src="../assets/img/qZone.png" 
        alt="qq空间">
        
        
        <!-- 分享到微信 -->
        <img 
        @click="shareToWechat"
        class="share"
        src="../assets/img/weChat.png" 
        alt="微信">
        
        <vue-qr 
        class="vue-qr"
        v-if="showQr"
        :margin="info.margin"
        :size="info.size"
        :text="info.url" />
    </div>
</template>
<script>
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
export default {
    name: 'ShareContent',  // 自己编写组件插件时name属性必须有，否则无视调用成功
    props: {
        info: {
            type: Object,
            default() { 
                return {};
            },
        }
    },
    components: {
        VueQr
    },
    data() {
        return {
            showQr: false
        }
    },
    computed: {
        targeUrl() {
            let params = {
                url: this.info.url,/*获取URL，可加上来自分享到QQ标识，方便统计*/
                title : this.info.title,/*分享标题(可选)*/
                summary : this.info.summary,/*分享描述(可选)*/
                pics : this.info.titleimg,/*分享图片(可选)*/
                desc:  this.info.desc
            }
            let array = []
            for (let item in params) {
                array.push(item + '=' + encodeURIComponent(params[item] || ''))
            }
            return array.join('&')
        }
    },
    methods: {
        shareToMicroblog() {
            window.open(`https://service.weibo.com/share/share.php?` + this.targeUrl)
        },
        shareToQQ() {
            window.open("http://connect.qq.com/widget/shareqq/iframe_index.html?" + this.targeUrl, 
                        'qq','height=520, width=720');
        },
        shareToQQRom() {
            window.open(
                "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + this.targeUrl
            );
        },
        shareToWechat() {
            this.showQr = !this.showQr
        }
    },
    directives: {
        clickOutside: {
            updated(el,binding) {
                function clickHandler(e) {
                    if (el.contains(e.target)) {
                        return false
                    } else {
                        binding.value()
                    }
                }
                el._vueClickOutside = clickHandler
                document.addEventListener('click',clickHandler)
            },
            unmounted(el) {
                document.removeEventListener('click',el._vueClickOutside)
            },
        }
    }
}
</script>
<style scoped>
.share-content {
    display: inline-block;
    position: relative;
}
.share-content .share {
    width: 32px;
    height: 32px;
}
.vue-qr {
    position: absolute;
    top: 50px;
    left: 0;
}
</style> 