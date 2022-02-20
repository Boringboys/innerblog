---
title: 对linux管道和grep，xrags的学习
author: Boringboys
date: 2021-01-16 11:52:33
categories: 
    - Linux
tags: 
    - grep
    - xargs
    - 管道
    - Linux
description:
preview:
---

## 管道
在linux中，管道可以将两个或多个命令的输入输出链接起来<!--more-->，它将上一个命令的标准输出重定向到下一个命令的标准输入
假设在当前目录下的结构是：
```
.
├── a
│   └── a.txt
├── b
│   └── b.txt
├── c
│   └── c.txt
├── d
│   └── d.txt
├── e
│   └── e.txt
└── test.txt
```
而文件 `test.txt` 内容是：
```
c
a
b
e
d
ab
abc
```
通过执行下面命令，`cat` 会将文件 `test.txt` 的内容打印到标准输出，但不会直接显示在标准输出设备上，而是会通过管道 `|` 重定向到 `sort` 并被 `sort` 排序之后再进行打印:
```
$ cat test.txt | sort
a
ab
abc
b
c
d
e
```

> 对于管道，由它串起来的命令实际上不是依次执行的，而是同时执行的，Linux会在系统内部将它们连接起来，在前面的命令产生输出的同时，输出会被立即送给后面的命令 

这里要注意的是，在这种使用方式中，后面的命令一定要支持接收标准输入，如果是 `ls` 这种不支持接收标准输入的命令，就会出现下面这种情况：
```
$ cat test.txt | ls
a  b  c  d  e  test.txt
```
显然显示的内容只是 `ls` 命令的输出结果

## grep命令
`grep` 命令会从给定的文件中或者标准输入中搜索匹配的行或文本并输出

因为 `grep` 命令是支持接收标准输入的，所以它也可以作为管道后面的命令来处理前面命令的输出，如下：
```
$ cat test.txt | sort | grep a
a
ab
abc
```
`grep a` 会对前面命令的结果进行筛选，并只将包含字符 `a` 的行打印出来

这里也可以看出来，在一条命令里可以使用多条管道。实际上，只要你想，可以在命令里使用任意多条管道，如：
```
cat test.txt | sort | grep a | grep b | grep c
```

## xargs命令
`xargs` 命令可以将标准输入转换为命令行参数

还是上面的命令，这次通过管道链接到 `xargs`，效果如下
```
$ cat test.txt | sort | xargs
a ab abc b c d e
```

回到前面，我们知道 `ls` 命令是不支持接收标准输入的，但我们可以通过 `xrags` 命令将标准输入转换成参数后传递给 `ls` 并进一步执行，如下：
```
$ cat test.txt | xargs ls
ls: cannot access 'ab': No such file or directory
ls: cannot access 'abc': No such file or directory
a:
a.txt

b:
b.txt

c:
c.txt

d:
d.txt

e:
e.txt
```
`cat test.txt` 的输出被管道重定向到后面的命令，并由 `xargs` 转换成参数传递给了 `ls`，然后依次执行，就分别列出了对应目录的内容，或者报出文件不存在的错误

对于 `xargs` 命令还可以通过参数 `-I` 指定其转换后的参数在后面命令中的位置，比如我们想将 `test.txt` 文件中所列的目录拷贝到 `./test/` 中，就可以用下面命令：
```
cat test.txt | xargs -I {} cp -r {} ./test/
```
执行结果如下：
```
$ cat test.txt | xargs -I {} cp -r {} ./test/
cp: cannot stat 'ab': No such file or directory
cp: cannot stat 'abc': No such file or directory

$ ls test
a  b  c  d  e
```
可以看到，结果会把 `test.txt` 中列出来并且存在的目录拷贝到 `./test/` 目录下