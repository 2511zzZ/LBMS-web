# 直播数据可视化系统

这是一个基于Spring Boot + Vue的直播数据可视化系统，实现了直播数据的可视化展示、分级权限管理、警报数据流处理、报表的统计与文件导出、实时事件通知等功能。

此部分为前端项目。后端地址：[LBMS](https://github.com/2511zzZ/LBMS)

### 项目简介

1. 基于[Ant Design Pro Vue](https://pro.antdv.com/docs/getting-started)脚手架进行开发
2. 使用[V-Chartz](https://v-charts.js.org/#/)、[ANTDV](https://www.antdv.com/docs/vue/introduce-cn/)等提供的组件，以及自己进行个性化封装，完成了对直播平台不同数据的可视化展示
3. 在用户不手动刷新页面的情况下，使用轮询完成了直播数据的实时刷新，使用WebSocket完成了警报事件的实时通知
4. 根据用户权限级别的不同定制化展示内容，主要包括：左侧菜单、表单选项、数据展示页（列表页/图表页）

### 预览

![online/total](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100049image-20200530134220601.png)

![online/team](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100105image-20200530134256146.png)

![history/branch](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100118image-20200530134310817.png)

![anchor/manage](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100134image-20200530134336404.png)

![report/statistics](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100635image-20200530134510776.png)

![report/pdf](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100153image-20200530134452124.png)![alarm/my-alarm](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100240image-20200530134704495.png)![alarm/transform](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100251image-20200530135131336.png)

![account](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100426image-20200530134551568.png)

![systen/settings](https://images.cnblogs.com/cnblogs_com/2511zzZ/1791329/o_200621100414image-20200530134619557.png)