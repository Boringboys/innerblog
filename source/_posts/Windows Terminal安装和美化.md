---
title: Windows Terminal安装和美化
author: Boringboys
date: 2021-07-25 15:30:13
tags:
	- 工具
	- Windows Terminal
categories:
	- 工具安装
description: Windows Terminal安装和美化
---

最近撸了人生中第一台自己的游戏主机（当然除了显卡，暂时是买不起了，也不太敢买），除了玩游戏，当然也得拿来学习啊，就开始配置之前的一些环境。索性就记录一下Windows Terminal的安装和简单美化。

<!--more-->

## 安装 Windows Terminal

从微软应用商店安装 **Windows Terminal**：

![从Microsoft Store安装Windows Terminal](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/%E4%BB%8EMicrosoft%20Store%E5%AE%89%E8%A3%85Windows%20Terminal.png)

Windows Terminal截图如下：

![Windows Terminal截图](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%E6%88%AA%E5%9B%BE.png)

## Windows Terminal 配置主题

点击 **新建标签页旁的下拉倒三角->Settings（设置）** 打开设置页面：

![Windows Terminal设置入口](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%E8%AE%BE%E7%BD%AE%E5%85%A5%E5%8F%A3.png)

在设置页面左侧点击 **Open JSON file（打开JSON文件）** ，从而通过Json配置文件进行自定义设置：

![Windows Terminal Json配置文件](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20Json%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)

配置文件结构大致长下图这样，文件中的注释已经讲述了不同配置位置的作用，我这里就稍微再详细描述一下，其中 **schemes** 列表中存放一些配色方案，

![Windows Terminal 自定义主题添加的位置](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E7%9A%84%E4%BD%8D%E7%BD%AE.png)

配色方案添加的格式如下图所示，可以添加很多个配色方案，并给他们定义对应的名字，方便在自定义配置中引用：

![Windows Terminal 添加自定义主题并配置主题名字](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%BB%E9%A2%98%E5%B9%B6%E9%85%8D%E7%BD%AE%E4%B8%BB%E9%A2%98%E5%90%8D%E5%AD%97.png)

> 至于什么是配色方案？emmm...据我的观察，应该就是定义红（red）是什么样的红，黑（black）是什么样的黑，以及黄（yellow）是什么样的黄这样的配置，以此类推，（逃）

然后是 **profiles**，这里就是添加一些配置的地方了，其中 **profiles->list** 列表中保存一些单独的配置，而 **profiles->defaults** 中是应用到所有配置中的通用配置，列表中的每个配置都有自己的名字，配置添加格式和 **schemes** 列表一样：

![Windows Terminal 自定义配置](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE.png)

- **colorScheme** 参数即配色方案，可以引用上面定义的那些配色方案。注意，每个配置（profile）的配色方案也可以不通过colorScheme参数引用，而是直接把配色方案写在配置中；

- **commandline** 参数设置了该配置使用的终端，包括powershell、cmd、git等...

- **fontFace** 参数设置该配置使用的字体

- **tabTitle** 参数是此配置打开的标签的标题；

- **name** 参数就是该配置的名字，出现在打开新标签页的下拉菜单中；

![Windows Terminal 配置的name和tabTitle](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E9%85%8D%E7%BD%AE%E7%9A%84name%E5%92%8CtabTitle.png)

这个网站有一些别人提供的配置，可以参考一下：
https://terminalsplash.com/

配置背景图片，通过 **backgroundImage** 参数可以自定义终端的背景图片，同时也可以通过参数配置背景图片的位置、透明度等：

![Windows Terminal配置背景图片](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E9%85%8D%E7%BD%AE%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.png)

![Windows Terminal背景图片](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/Windows%20Terminal%20%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.png)

## 安装 oh-my-posh

为了有和Linux上 **oh-my-zsh** 类似的体验，下面还会安装 **oh-my-posh** 模块对Powershell进一步进行美化

使用管理员身份启动Powershell，安装 **posh-git** 和 **oh-my-posh** 模块，安装前设置权限为 **RemoteSigned**。

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

```
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

安装时如果提示需要安装 **NuGet**，同意安装即可。

![安装posh-git](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/%E5%AE%89%E8%A3%85posh-git.png)

![安装oh-my-posh](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/%E5%AE%89%E8%A3%85oh-my-posh.png)

为了让Powershell有彩色输出，还需要安装 **Get-ChildItemColor** 模块。

```
Install-Module -AllowClobber Get-ChildItemColor
```

![安装Get-ChildItemColo](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/%E5%AE%89%E8%A3%85Get-ChildItemColor.png)

编辑 **Powershell 配置文件** 

`$PROFILE` 查看配置文件路径

`code $PROFILE` 使用vscode打开配置文件，使用其他编辑器的自行操作，用什么编辑器不重要

在配置文件中，输入以下内容：

```
Import-Module posh-git
Import-Module oh-my-posh
Set-PoshPrompt -Theme half-life  // 设置主题
If (-Not (Test-Path Variable:PSise)) {
    Import-Module Get-ChildItemColor
    Set-Alias l Get-ChildItem -option AllScope
    Set-Alias ls Get-ChildItemColorFormatWide -option AllScope
}
```

其中 `Set-PoshPrompt -Theme half-life` 设置了 **oh-my-posh** 主题 **half-life**，这里可以根据自己喜好选择不同的主题，可以通过命令 `Get-PoshThemes` 获取主题列表

配置后的Powershell的样子：

![配置oh-my-posh之后的样子](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/%E9%85%8D%E7%BD%AEoh-my-posh%E4%B9%8B%E5%90%8E%E7%9A%84%E6%A0%B7%E5%AD%90.png)

可以看到有一些乱码，因为很多oh-my-posh主题使用的是powerline字体，你的系统上可能没有安装，可以自行到这里下载并安装自己喜欢的powerline字体：https://github.com/powerline/fonts

安装好字体后还需要配置Windows Terminal使用安装好的字体才可以

Windows Terminal字体的配置就是在上面提到的 **profile** 中的 **fontFace** 参数

针对vscode等其它应用，也需要配置终端使用powerline字体才可以正常显示，具体方法自行检索

**oh-my-posh** 展示

![oh-my-posh主题展示](https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/img/Windows-Terminal-Install/oh-my-posh%E4%B8%BB%E9%A2%98%E5%B1%95%E7%A4%BA.png)

>参考教程：https://blog.reilkay.com/BeautifyWindowsTerminal/