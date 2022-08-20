# 修改powershell权限

#### 一、PowerShell简单介绍

 PowerShell是一种跨平台的任务自动化解决方案，由命令行shell、脚本语言和配置管理框架组成，可以在Windows、Linux以及macOS上运行。

PowerShell是新式命令shell，与大多数仅接受并返回文本的shell不同，PowerShell接受并返回。NET对象。

本机PowerShell命令称为cmdlet，收集在PowerShell模块中按需加载，而不是独立的可执行文件，可以.NET或者PowerShell脚本语言本身来编写cmdlet。

#### 二、PowerShell执行权限

 有时候我们通过一些脚本来更改系统注册表设置、执行某些脚本等场景下，会遇到无法执行的情况，提示“无法加载文件xxx，因为在此系统上禁止运行脚本”，如下：

![null](http://doc.bufanui.com/uploads/vue/images/m_42c31d8c55bfcea9171323d61246f304_r.png)

![null](http://doc.bufanui.com/uploads/vue/images/m_3c699f8d63a5432ca42c82d6488e27fa_r.png)

这是因为Windows默认策略是不允许任何脚本运行，可以使用“Set-ExecutionPolicy”cmdlet来更改这个策略。powershell脚本具有4种执行权限：

- Restricted。默认的设置，不允许任何脚本的运行

- AllSigned。只能运行经过数字证书签名的脚本

- RemoteSigned。运行本地的脚本不需要数字签名，但运行从网络下下载的脚本就必须要有数字签名

- Unrestricted。允许所有的脚本运行。

  #### 三、权限修改方式

   打开explorer，然后管理员权限打开PowerShell。然后，通过“Set-ExecutionPolicy”cmdlet进行修改。例如，将PowerShell的执行权限修改为允许所有的脚本运行：

  ```javascript
  1.先以管理员身份运行
  2.运行：set-ExecutionPolicy RemoteSigned
  选A
  ```