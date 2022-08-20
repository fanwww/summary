一.split
split主要用于字符串的分割，可以根据某个字符把字符串拆分成多个数组


 var str = “Front-end-bully”

     Arr = str.slite(“-”);    //[‘Front’,’end’,’bully’]
二.splice
splice可根据坐标位置进行删除数组并返回长度,会改变原数组

splice(index,num,item1)
3个参数

第一个坐标位置，第二个要删除的项目数量。如果设置为 0，则不会删除项目，第三个向数组添加的新项目

![](https://img-blog.csdnimg.cn/20181211094749625.png)

三.slice
slice可以创建一个由当前数组中的一项或多项组成的新数组，原有的数组不变

slice（par1，par2）

2个参数，如果只有一个参数，则会截取从par1开始的到原数组最后的部分，2个参数的话是截取par1到par2之间

 

一个参数如下图（会发现原有的数组没有变换）

![X](https://img-blog.csdnimg.cn/20181211095352602.png)

两个参数如下图（会发现原有的数组没有变换）

![](https://img-blog.csdnimg.cn/20181211095511169.png)