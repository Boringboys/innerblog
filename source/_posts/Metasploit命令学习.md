---
title: Metasploit命令学习
author: Boringboys
date: 2018-03-29 20:43:13
tags:
	- 安全
	- 工具
	- 学习
categories:
	- 安全
description: Metasploit命令
---

## 概述
为了方便自己后期的学习，我把metasploit的帮助信息简单翻译了一下，包括命令和一些用法描述。

<!--more-->

核心命令
=============

    命令          描述
    -------       -----------
    ?             帮助菜单
    banner        在命令行里显示一个好看的metasploit图案（一个很有趣的命令^0^）
    cd            更改当前工作目录
    color         启用或禁用颜色输出
    connect       连接到一个主机
    exit          退出msfconsole
    get           获得一个上下文特定变量的值
    getg          获得一个全局变量的值
    grep          从另一个命令的输出中查找符合条件的行
    help          帮助菜单
    history       显示历史命令
    load          加载框架插件
    quit          退出msfconsole（有提示Y/N）
    repeat        重复一个命令列表
    route         通过会话路由流量
    save          保存活动数据
    sessions      转储会话列表并显示有关会话的信息
    set           设置一个上下文特定变量的值
    setg          设置一个全局变量的值
    sleep         在指定的秒数内不执行任何操作
    spool         将控制台输出写入某个文件
    threads       查看和操纵后台线程
    unload        卸载框架插件
    unset         取消设置一个或多个上下文特定变量的值
    unsetg        取消设置一个或多个全局变量的值
    version       显示框架和控制台库版本号


模块命令
===============

    命令       	  描述
    -------       -----------
    advanced      显示一个或多个模块的高级选项
    back          从当前上下文后退
    info          显示一个或多个模块的信息
    loadpath      从路径搜索模块并加载
    options       显示一个或多个模块的全局选项
    popm          将最新模块弹出堆栈并使其激活
    previous      将先前加载的模块设置为当前模块
    pushm         将活动模块或模块列表推入模块堆栈
    reload_all    从所有定义的模块路径重新加载所有模块
    search        搜索模块名称和描述
    show          显示给定类型的模块，或者所有模块
    use           按名称选择模块


作业命令
============

    命令          描述
    -------       -----------
    handler       启动有效负载处理程序作为作业
    jobs          显示和管理作业
    kill          杀死作业
    rename_job    重命名作业


资源脚本命令
========================

    命令          描述
    -------       -----------
    makerc        将启动之后输入的命令保存到文件中
    resource      运行文件中的命令


数据库后端命令
=========================

    命令              描述
    -------           -----------
    analyze           分析有关特定地址或地址范围的数据库信息
    db_connect        连接到现有的数据服务
    db_disconnect     断开当前数据服务
    db_export         导出包含数据库内容的文件
    db_import         导入扫描结果文件（将自动检测文件类型）
    db_nmap           执行nmap并自动记录输出
    db_rebuild_cache  重建数据库存储的模块缓存
    db_remove         删除保存的数据服务条目
    db_save           将当前数据服务连接保存为默认值，以便在启动时重新连接
    db_status         显示当前数据服务状态
    hosts             列出数据库中的所有主机
    loot              列出数据库中的所有Loot(战利品)
    notes             列出数据库中的所有注释
    services          列出数据库中的所有服务
    vulns             列出数据库中的所有漏洞
    workspace         在数据库工作区之间切换


凭证后端命令
============================

    命令          描述
    -------       -----------
    creds         列出数据库中的所有证书


开发人员命令
==================

    命令          描述
    -------       -----------
    edit          使用首选的编辑器编辑当前模块或文件
    irb           在当前上下文中打开一个交互式Ruby Shell
    log           如果可以，将framework.log显示到页面末尾
    pry           在当前模块或框架上打开Pry调试器
    reload_lib    从指定路径重新加载Ruby库文件


msfconsole
==========

**msfconsole**是Metasploit框架的主要接口。使用者可以通过这个控制台高效的使用MSF中的各种功能。 
可以在终端或命令行界面直接输入`msfconsole`启动。


范围和列表
-------------------------

上面列出的许多命令和选项都可以使用范围，所以不必手动列出每个需要的事物。所有范围均包括在内。

### ID范围

带有ID列表的命令可以使用范围来提供帮助。各个ID必须以`,`分隔（不允许有空格），
范围可以用`-`或`..`表示。

### IP范围

这里有多种方法可以用来指定能混合在一起的IP地址范围：
- 第一种方法是一个IP列表，这些IP仅由`' '`（ASCII空格）分隔，并带有可选的`,`。
- 第二种方式是用两个完整的IP地址表示范围，格式为*“开始地址-结束地址”*，例如`127.0.1.44-127.0.2.33`。
- 也可以使用CIDR规范，但是，与RFC相反，必须将整个地址提供给Metasploit，例如127.0.0.0/8，而不是127/8。
- 此外，可以将网络掩码与域名一起使用以动态解析要定位的块。

所有这些方法都适用于IPv4和IPv6地址。也可以根据[NMAP目标规范](https://nmap.org/book/man-target-specification.html)用特殊的八位位组范围指定IPv4地址。

### 示例

终止第一个会话：

    sessions -k 1

停止一些正在运行的作业：

    jobs -k 2-6,7,8,11..15

检查一组IP地址：

    check 127.168.0.0/16, 127.0.0-2.1-4,15 127.0.0.255

定位一组IPv6主机：

    set RHOSTS fe80::3990:0000/110, ::1-::f0f0

定位来自解析域名的块：

    set RHOSTS www.example.test/24


>翻译：Boringboys  
>原文链接：https://www.boringboys.top/2019/03/29/Metasploit命令/  
>版权声明：本文采用[BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/)协议授权，转载请遵守此协议
