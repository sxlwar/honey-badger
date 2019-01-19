# Angular完全开发手册

## development

由于项目使用了服务端渲染，为了测试此功能将开发环境分成了dev和test两个环境，test环境主要用于测试服务端渲染，除此之外并没有什么不同。

> dev环境，完全前后端分离，分别进行开发。

> test环境，需要把打包后的前端代码放置在 **/web** 目录下。

## run

> npm run start:dev 项目将运行在development环境下，此时的github验证将会重定向到 http://localhost:4200 下，日常开发时将使用此环境

> npm run start:test 项目将运行在test环境下，此时的github验证将会重定向到 http://localhost:3000 下，开发完成后进行本地测试时使用此环境

## api test

浏览器中输入<u>http://localhost:3000/swagger/api</u>进入接口测试页面。

## database

数据库版本：mysql  Ver 8.0.12

你可以![这里](https://github.com/sxlwar/test.bk.sql)找到测试数据。

