# LofoVIS 前端

## 配置说明

    config/index.js文件为开发和编译基础参数
    包括: flexible, ftp, proxy 等

## 命令参考

    # 安装
    npm install
    npm run fixhot

    # 开发
    npm run dev m/home 或 npm run dev m
    http://127.0.0.1:8082

    # 编译
    npm run build m/home 或 npm run build m

    # 拷贝
    npm run copy m/home 或 npm run copy m

    # 上传(支持目录和单文件)
    npm run ftp m/home/index.js
    npm run ftp m/home
    npm run ftp m

## 目录说明

    # src    源码
    以_开头目录的为编译型源码，只参与编译不生成最终dist，建议用于公共代码部份抽离

    # staticDev 静态资源
    因为前端开发时的static已经被代理到后端路径，所以这里用staticDev，
    可用于存放前端的img或其他资源，build时会同步拷贝到dist/moduleName/static目录
