define([
    'jquery',
    'common', 
    'text!tpl/device/edit-device.tpl',
    'layuiAll',
    'css!css/device/list'
], function(
    $, 
    HSKJ,
    editDeviceTpl
){
return function (editData, parentJs) {
    console.log('editData', editData)
    console.log('parentJs', parentJs)
    HSKJ.ready(function () {
        var deviceEdit = {
            init: function () {
                this.renderHtml();
                this.wactch();
            },

            renderHtml: function() {
                var self = this;
                layer.open({
                    type: 1,
                    title: '编辑设备',
                    btn: [],
                    content: layui.laytpl(editDeviceTpl).render(editData || {}),
                    area: ['549px'],
                    skin: 'module-device-edit-dialog',
                    success: function (layero, index) {
                        layui.laydate.render({
                            elem: '#produceddate'
                            , type: 'datetime'
                            , format: 'yyyy-MM-dd HH:mm:ss'
                        });
                        layui.form.render();
                        self.formVerify();
                    }
                })
            },

            formVerify: function () {
                layui.form.verify({
                    macaddress: function (value, item) { //value：表单的值、item：表单的DOM对象，macaddress 对应form 里lay-filter
                        if (/^[\u4e00-\u9fa5],{0,}$/.test(value)) {
                            return 'Mac地址不能为中文';
                        }
                        if (!new RegExp("^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$").test(value)) {
                            return 'Mac地址格式不正确';
                        }
                    }
                });
            },

            wactch: function () {
                var self = this; 

                //编辑设备的保存
                layui.form.on('submit(element-submit)', function (data) {
                    if (data.field.devicetype == "立式机") {
                        data.field.type = "2"
                    } else {
                        data.field.type = "1"
                    }
                    data.field.name = data.field.devicetype;

                    HSKJ.POST({
                        url: 'organization/device/update',
                        data: data.field,
                        beforeSend: function () {
                            HSKJ.loadingShow();
                        },
                        success: function (json) {
                            if (json && json.code == 0) {
                                layui.layer.msg('编辑成功', { icon: 1 }, function () {
                                    parentJs.getStatAjax(1);
                                    //parentJs.renderTable();
                                    parentJs.reloadTable();
                                    layui.layer.closeAll();
                                })
                            } else {
                                layui.layer.msg(json.message)
                            }
                        }
                    })
                    return false;
                });

            }
        }
        deviceEdit.init();
    })
}}
)