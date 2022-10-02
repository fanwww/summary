<script>
var app = new Vue({
    el: '#homediv',
    data() {
        //规范手机号
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
                if (reg.test(value)) {
                    this.phone_active = true;
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        };
        return {
            user: JSON.parse(sessionStorage.getItem("userName")),
            listCompany: JSON.parse(sessionStorage.getItem("userName")).listCompany,
            listCompamyAccess: JSON.parse(sessionStorage.getItem("userName")).listCompamyAccess,
            item: {},
            companyId: '',
            curRole: JSON.parse(sessionStorage.getItem("userName")).curRole,
            curGroupId: JSON.parse(sessionStorage.getItem("userName")).curGroupId,
            curCompanyId: JSON.parse(sessionStorage.getItem("userName")).curCompanyId,
            userPsw: JSON.parse(sessionStorage.getItem("userPsw")),
            curCompany: '',
            isShow: true,

            activeIndex: '2',
            activeIndex2: '2-2',

            //isShowAddWorker: false,
            NowCompanyId: '',
            NowCompanyName: '',

            form: {
                phone: '',
            },
            showNum: false,
            wait_timer: false,
            phone_active: false,
            rules: {
                phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },

            //excel
            fileNameKey: new Date().getTime(),
            excelData: [],
            dialogUserVisible: false,
            userForm: {
                password: '',
            },
            formLabelWidth: '100px',
            isLegal: true,

            fileList:[],
        }
    },
    created() {
        this.getCurRole();
       
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },

        handleClick(row) {
            console.log(row);
        },

        getCurRole() {
            if (this.curRole == 1) {
                if (this.curCompanyId != 0) {
                    for (index in this.user.listCompany) {
                        if (this.user.listCompany[index].company_id == this.curCompanyId) {
                            this.curCompany = this.user.listCompany[index].comment
                        }
                    }
                } else {
                    this.curCompany = this.curCompanyId
                }
            } else if (this.curRole == 0) {
                if (this.curGroupId != 0) {
                    for (index in this.user.listGroup) {
                        if (this.user.listGroup[index].group_id == this.curGroupId) {
                            this.curCompany = this.user.listGroup[index].comment
                        }
                    }
                } else {
                    this.curCompany = this.curGroupId
                }
            }
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },

        handleCloseUser() {
            this.dialogUserVisible = false;
            // 1.表单初始化
            this.userForm = {
                password: '',
            };
            // 2.添加判断
            if (this.$refs.userForm !== undefined) {
                this.$refs.userForm.resetFields();
            }
        },

        // 下载excel
        GetExcelTemplate() {
            $.ajax({
                type: "post",
                url: "/user/GetExcelTemplate",
                data: {
                    //"para": jsStrArr,
                    //"paraType": jsType,
                    //"modelurl": modelInfourl
                },
                async: true,
                success: function (res) {
                    let u8Arr = new Uint8Array(res.value);
                    let blob = new Blob([u8Arr], { type: "application/octet-binary" });

                    let url = window.URL.createObjectURL(blob);

                    // 创建a标签，并隐藏改a标签
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    // a标签的href属性指定下载链接
                    link.href = url
                    //setAttribute() 方法添加指定的属性，并为其赋指定的值。
                    let fileName = "用户名单" + ".xls";
                    link.setAttribute('download', fileName)
                    document.body.appendChild(link)
                    link.click();
                    //--startRender;
                }
            });
        },
        // 获取excel信息
        getExcel() {
            _this = this;
            console.log("进入excel")
            $("#files").change(function (e) {
                //console.log("上传了")
                var files = e.target.files;
                //console.log(files)
                var fileReader = new FileReader();
                //console.log(fileReader)
                fileReader.onload = function (ev) {
                    //console.log("进入")
                    //console.log(this.result);
                    try {
                        var data = ev.target.result,
                            //以二进制流方式读取得到表格中数据  
                            workbook = XLSX.read(data, { type: 'binary' }),
                            info = [];//存储获取到的数据  
                    } catch (e) {
                        alert('文件类型不正确');
                        return;
                    }
                    //console.log(workbook)
                    //_this.fileName = workbook.SheetNames[0]
                    //console.log(_this.fileName)
                    var fromTo = '';
                    //遍历每张表读取  
                    for (var sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            fromTo = workbook.Sheets[sheet]['!ref'];
                            info = info.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        }
                    }
                    //console.log("info")
                    //console.log(info)
                    _this.excelData = info;
                    console.log("excelData")
                    console.log(_this.excelData)
                }
                //以二进制方式打开文件  
                fileReader.readAsBinaryString(files[0]);
            })
        },
        // 判断数据合法性
        determineExcelData() {
            const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/;
            if (this.excelData.length <= 0) {
                alert("请上传正确格式的文件");
                this.isLegal = false;
            } else {
                var workNumber = [];
                var phone = [];
                for (i = 0; i < this.excelData.length; i++) {
                    if (this.excelData[i]["密码(空时默认123456)"] == undefined) {
                        this.excelData[i]["密码(空时默认123456)"] = md5(123456);
                    } else {
                        this.excelData[i]["密码(空时默认123456)"] = md5(this.excelData[i]["密码(空时默认123456)"]);
                    }
                    if (this.excelData[i]["工号"] == undefined) {
                        alert("检测到表中有工号为空");
                        this.isLegal = false;
                        break;
                    } else {
                        if (workNumber.indexOf(this.excelData[i]["工号"]) == -1) {
                            workNumber.push(this.excelData[i]["工号"]);
                        } else {
                            alert("检测到表中有工号重复");
                            this.isLegal = false;
                            break;
                        }
                    }
                    if (this.excelData[i]["手机号(必填)"] == undefined) {
                        alert("检测到表中有手机号为空");
                        this.isLegal = false;
                        break;
                    } else if (!reg.test(this.excelData[i]["手机号(必填)"])){
                        alert("检测到表中不正确的手机号码");
                        this.isLegal = false;
                        break;
                    } else {
                        if (phone.indexOf(this.excelData[i]["手机号(必填)"]) == -1) {
                            phone.push(this.excelData[i]["手机号(必填)"]);
                        } else {
                            alert("检测到表中有手机号重复");
                            this.isLegal = false;
                            break;
                        }
                    }
                    if (this.excelData[i]["用户名"] == undefined) {
                        alert("检测到表中有用户名为空")
                        this.isLegal = false;
                        break;
                    }
                    console.log(this.excelData[i])
                }
            }
            console.log("处理后数据")
            console.log(this.excelData)
        },
        // 上传excel
        submitExcel() {
            this.determineExcelData();
            //console.log(this.isLegal)
            excelData = JSON.stringify(this.excelData)
            console.log(excelData)
            var bIsCompany;
            if (this.curRole == 0) {
                bIsCompany = false;
            } else if (this.curRole == 1) {
                bIsCompany = true;
            }
            if (this.isLegal == true) {
                $.ajax({
                    url: "/register/BatchAddUser",
                    type: "post",
                    data: {
                        "phone": this.user.phone,
                        "psw": md5(this.userForm.password),
                        "info": excelData,
                        "bIsCompany": bIsCompany,
                        "id": this.curCompanyId,
                    },
                    success: function (result) {
                        console.log(result);
                        _this.$refs['userForm'].resetFields();
                        document.getElementById('excelForm').reset()
                        //_this.isShowAddWorker = false;
                        alert(result.Msg);

                    }
                    ,
                    error: function (result) {
                        console.log(result.msg);
                        _this.$refs['userForm'].resetFields();
                        document.getElementById('excelForm').reset()
                        //_this.isShowAddWorker = false;
                        //alert(result.msg);
                    }
                });
            }
        },

        //下拉-展示工厂
        //showAddWorker(value) {
        //    console.log(value);
        //    console.log(this.listCompany[value]);

        //    // 不考虑权限
        //    //this.isShowAddWorker = true;
        //    this.NowCompanyName = this.listCompany[value].comment;
        //    this.NowCompanyId = this.listCompany[value].company_id;
        //},

        //添加人员
        submitForm() {            
            if (this.form.phone == "") {
                alert("请正确填写手机号码");
            }
            else if (this.form.phone != "") {
                _this = this;
                const reg1 = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
                if (!reg1.test(this.form.phone)) {
                    alert("请正确填写手机号码");
                } else {
                    $.ajax({
                        url: "/register/AddCompanyUser",
                        type: "post",
                        data: {
                            "phone": this.user.phone,
                            "psw": md5(this.userPsw),
                            "companyId": this.curCompanyId,
                            "phone2": this.form.phone,
                            "defaultPsw": md5(123456),
                        },
                        success: function (result) {
                            console.log(result);
                            _this.$refs['form'].resetFields();
                            //_this.isShowAddWorker = false;                            
                            
                            if (result.Msg == '用户尚未注册') {
                                alert("用户尚未注册,请先注册");
                            } else {
                                alert(result.Msg);
                            }
                            
                        }
                        ,
                        error: function (result) {
                            console.log(result.msg);
                            _this.$refs['form'].resetFields();
                            //_this.isShowAddWorker = false;
                            alert(result.msg);
                        }
                    });
                }
            }
        },

        cancelAdd() {
            this.$refs['form'].resetFields();
            //this.isShowAddWorker = false;
            
        },

        logout() {
            window.sessionStorage.clear();
            if (document.cookie.length > 0) {
                window.document.cookie = "isChoose" + "=" + "" + ";path=/;expires=" + 0;
            }
            window.location.href = "login.html";
        },
    },

})
</script>