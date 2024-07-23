# create-vvts
快捷创建模板

## 为什么？
每次重开项目可能都会去现有的项目中copy一份，然后去掉一些代码
但是这样做如果删的时候没注意，很可能会导致报错，难以排查

## 实现
通过create-vue和create-vite的源码，结合两者，个人写了一份很简单的个人使用脚手架
- 使用`typescript`来编写
- 使用`esbuild`来进行打包

## 使用
可以直接执行以下命令查看效果，目前个人只整理了pc端的模板
```sh
npm create vvts@latest
```

当然你也可以直接将项目拉下来，然后自己改下templates目录下的模板
将package.json中的配置改成自己的
执行`npm publish`发布自己的脚手架

## 本地
可以直接通过`npm run dev`来执行脚本，查看效果

## PC端模板
[PC端模板介绍](https://github.com/liwenhao-95/vue3-template-pc/blob/master/README.md)