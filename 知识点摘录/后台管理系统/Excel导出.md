# Excel导出

### 1.引入插件

> 相关文档: https://panjiachen.gitee.io/vue-element-admin-site/zh/feature/component/excel.html

从panjiachen的项目里下载的**vue-element-admin-master**(https://github.com/PanJiaChen/vue-element-admin) 的src里的vendor文件复制到我们的项目里

安装依赖包

```
npm install xlsx file-saver -S
npm install script-loader -S -D
```

### 2.页面使用

引入导出按钮

```
    <el-button
          type="primary"
          size="mini"
          :loading="downloadLoading"
          @click="handleDownload"
        >
          导出商品列表excel文件
        </el-button>
```

导出事件, 要把数据格式变成数组的形式

```
        handleDownload() {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then((excel) => {
                const tHeader = ['商品名称', '商品品牌', '商品价格']
                const filterVal = ['name', 'brandName', 'price']
                const list = this.productList
                const data = this.formatJson(filterVal, list)
                // console.log('list===',JSON.stringify()list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'product-list',
                      autoWidth: true,
                      bookType: 'xlsx'
                })
                this.downloadLoading = false
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    return v[j]
                })
            )
```