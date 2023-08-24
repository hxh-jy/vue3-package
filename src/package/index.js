import ShareContent from "./share-content.vue";
const components = [ShareContent]
const install = function (app) {
    components.forEach((component) => {
        app.component(component.name,component)
    })
}

// export default {
//     install: (app) => {
//         components.forEach((component) => {
//             console.log('测试插件',component)
//             app.component(component.name,component)
//         })
//     }
// }
export default install