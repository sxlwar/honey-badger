# Angular完全开发手册

## development

由于项目使用了服务端渲染，为了测试此功能将开发环境分成了dev和test两个环境，test环境主要用于测试服务端渲染，除此之外并没有什么不同。

> dev环境，完全前后端分离，分别进行开发。

> test环境，需要把打包后的前端代码放置在 **/web** 目录下。

## run

> npm run start:dev 项目将运行在development环境下，此时的github验证将会重定向到 http://localhost:4200 下，日常开发时将使用此环境

> npm run start:test 项目将运行在test环境下，此时的github验证将会重定向到 http://localhost:3000 下，开发完成后进行本地测试时使用些环境
