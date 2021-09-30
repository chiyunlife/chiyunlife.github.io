---
title: mac废纸篓不能清空的问题
categories:
  - 小技巧
tags:
  - Mac使用
date: 2021-09-30 09:44:26
---

## 问题成因

某个压缩包解压后，文件夹里带有Mac专有的文件，比如`__MaxOS`，`Library`啥的，然后用完之后就移除到了废纸篓。自此噩梦就开始了，这个文件夹就跟牛皮糖一样，每次清空废纸篓都报错误，说没有权限，不能删除。试验了如下几种方式均不好使。

1. 网上说的通过terminal直接删除
```bash
sudo rm -rf ~/.Trash

```
执行后terminal会报错，没有权限

2. 通过磁盘工具，对磁盘进行`First Aid`。这个也不好使，删不掉。


<!--more-->

## 解决方法

最后还是通过重启电脑并进入`恢复模式`（recovery mode）才得以解决。 

1. 具体的操作方法是电脑重启后，在听到"咣"的一声后，按下command+R，之后等到看到苹果进度条后，就可以松手了。（PS：这个操作试了很多次才成功。后来发现是自己按的太早，刚一听到声音甚至听到之前就按下去了，其实应该按照一个人放松时的反应，听到声音后一秒左右再按刚刚好）。
2. 进入恢复模式后，点击顶部菜单中，选择`Terminal`进入。
3. 将网上提到的几种操作都执行了一遍，其实不太确定是哪个生效.
```bash
cd  Macintosh\ HD   //这个可以ls一下看看具体的名字是什么。我理解terminal进入时是位于一个独立的系统区，因此要先进入我们真正使用的硬盘数据区。
cd Volumn/Users/username  //大致是这个路径吧，记不太清了。就是找到硬盘数据区上的个人文件夹。

csrutil disable //关掉ISP功能。可能就是这个功能的误判断，导致清空不掉
rm -rf .Trash //这次没有报权限错误

reboot  //重启电脑
```

之后正常启动进入电脑桌面后，查看废纸篓，空空如也。这个牛皮糖终于清理了~~

## 解决之后

别忘了重新进入`恢复模式`，打开`Terminal`。在里面执行
```bash
csrutil enable //重新打开ISP功能，这个毕竟是苹果保护系统文件不被恶意损坏的机制，所以还是打开为好。
```

## 参考文档

[https://www.macube.com/how-to/fix-cannot-empty-trash-mac.html](https://www.macube.com/how-to/fix-cannot-empty-trash-mac.html)
