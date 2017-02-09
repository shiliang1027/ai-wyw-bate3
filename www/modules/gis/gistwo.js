/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone', 'bmap', 'bmaplib', 'modules/gis/selectmodel', 'text!modules/gis/gisTwoViewTemplate.html'], function ($, _, Backbone, BMap, BMapLib, SelectModel, gisTwoViewTemplate) {

    var GisTwoView = Backbone.View.extend({
        template: _.template(gisTwoViewTemplate),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "click .fbg a": "click_fbg_a",
            "click .close_map": "close_map",
            "tap .checkboxList": "click_checkboxfor",
            "click #px": "click_px",
            "click #search_map_btn": "click_search_map_btn",
            "click #search_drop_down": "click_search_drop_down",
            "click #search_drop_down a": "click_search_drop_down_a",
            "keyup #search_map": "change_search_map",
            "click #search_map": "click_search_map"
        },
        initialize: function (options) {
            this.pageSize = 999999;
            this.pageNo = 0;
            this.pageMax = 0;
            //查询下拉区域显示的结果数
            this.queryLength = 5;
            this.searchResult = localStorage.getItem("gis.querys") != null ? JSON.parse(localStorage.getItem("gis.querys")).reverse() : [];
            this.undoAjax;
            this.map = {};
            this.locationFlag=false;//确定定位状态
            //基站各地市中心点ｍａｒｋｅｒ
            this.markers = {};
            //断站各地市中心点ｍａｒｋｅｒ
            this.markers2 = {};
            this.cMarker = {};
            this.type = "2";
            //五个按钮，０－排行，１－基站，２－断站，３－ＯＬＴ，４－ＯＬＴ故障，５－设置
            this.typetip = ["", "地图中只显示所有基站数据", "地图中只显示断站数据", "地图中只显示OLT数据", "地图中只显示OLT故障数据", ""];
            this.queryflag = false;
            this.refreshflag = true;
            this.keyWord = "";
            this.searchInfoWindow;
            this.markerClusterer;
            this.geolocation = new BMap.Geolocation();
            this._IMAGE_PATH = 'js/libs/baidumap/images/m';
            this._IMAGE_EXTENSION = 'png';
            this.selectG = new SelectModel();
            this.selectG.on('change', function (model) {
                sessionStorage.setItem("select_set", JSON.stringify(model));
            });
        },
        click_fbg_a: function (event) {
//			console.info(event.currentTarget);

            $(".fbg a").each(function () {
                $(this).removeClass("active");
            });
            $(event.currentTarget).addClass("active");
            this.type = $(event.currentTarget).attr("type");

            switch (this.type) {
                case "0":
                    //排行
                    Backbone.trigger("goModule", {
                        "moduleurl": "modules/gis/ranking"
                    });
                    break;
                case "1":
                //基站
                case "2":
                //断站
                case "3":
                //ＯＬＴ
                case "4":
                    //ＯＬＴ故障
                    showToast(this.typetip[this.type]);
                    this.mapRefresh();
                    break;
                case "5":
                    //设置
                    $('.mask_map, #base_station_main').show();
                    break;
                case "6":
                    this.addTileLayer();
                    this.isOffline = true;
                    break;
            }
        },
        click_checkboxfor: function (event) {
            $(event.currentTarget).find('label').toggleClass('on');
            $(event.currentTarget).find('input[type=checkbox]').attr("sign", $(event.currentTarget).find('input[type=checkbox]').attr("sign") == "unchecked" ? "checked" : "unchecked");
            var name;
            if ($(event.currentTarget).attr("id").indexOf("dz") == 0) {
                name = "d" + $(event.currentTarget).find('span').text();
            } else {
                name = "s" + $(event.currentTarget).find('span').text();
            }
            console.info(name)
            this.selectG[name].selected = $(event.currentTarget).find('input[type=checkbox]').attr("sign") == "unchecked" ? false : true;
            console.info( this.selectG[name].selected);

        },
        close_map: function (param) {
            $('.mask_map').hide();
            $(param.toElement).parent().slideUp();
        },
        pageHide: function () {
            console.info("page hide ----");
            this.map = {};
            this.layers = {};
            this.markers = {};
            this.markers2 = {};
            this.cMarker = {};
            this.queryflag = false;
        },
        pageShow: function () {
            var that = this;
            console.info($(document).width() + "---->" + $(document).height());
            setTimeout(function () {
                try {
                    var region = sessionStorage.getItem("choseRegion");
//				var tileLayer = new BMap.TileLayer({
//			        isTransparentPng: true
//			    });
//			    tileLayer.getTilesUrl = function (tileCoord, zoom) {
//			        var x = tileCoord.x;
//			        var y = tileCoord.y;
//                    console.info("-------------------------"+'maptitle/' + zoom + '/' + x + '/' + y + '.png');
//			        return 'maptitle/' + zoom + '/' + x + '/' + y + '.png';
//			    };
                    that.map = new BMap.Map("mapContainer");
//				that.map.addTileLayer(tileLayer);
//                console.info(region)
                    that.map.centerAndZoom(region, 9);
                    // 初始化地图，设置中心点坐标和地图级别
                    that.map.enableScrollWheelZoom();
                    that.map.addControl(new BMap.NavigationControl());
                    // 添加默认缩放平移控件
                    // 添加定位控件
                    var geolocationControl = new BMap.GeolocationControl();
                    geolocationControl.addEventListener("locationSuccess", function (e) {
                        // 定位成功事件
                        that.locationFlag=true;
                        var address = '';
                        address += e.addressComponent.province;
                        address += e.addressComponent.city;
                        address += e.addressComponent.district;
                        address += e.addressComponent.street;
                        address += e.addressComponent.streetNumber;

                    });
                    geolocationControl.addEventListener("locationError", function (e) {
                        // 定位失败事件
                        alert(e.message);
                    });
                    that.map.addControl(geolocationControl);
                    that.markerClusterer = new BMapLib.MarkerClusterer(that.map, {
                        minClusterSize: 2
                    });

                    that.map.addEventListener("dragstart", function () {
                        console.info("dragstart");
                        that.drag = true;
                    });
                    that.map.addEventListener("dragend", function () {
                        console.info("dragend");
                        that.drag = false;
                        that.mapRefresh();
                    });
                    that.map.addEventListener("zoomstart", function () {
                        console.info("zoomstart");
                        that.zoom = true;
                    });
                    that.map.addEventListener("zoomend", function () {
                        console.info("zoomend");
                        that.zoom = false;
                        that.drag = false;
                        that.mapRefresh();
                    });
                    that.initCityCenter();

                } catch (e) {
                    console.error(e)
                }
            }, 500);
//			this.initSearchDown();
        },
        addTileLayer:function(){
            var tileLayer = new BMap.TileLayer({
                isTransparentPng : true
            });
            tileLayer.getTilesUrl = function(tileCoord, zoom) {
                var x = tileCoord.x;
                var y = tileCoord.y;
                console.info("-------------------------" + 'maptitle/' + zoom + '/' + x + '/' + y + '.png');
                return 'maptitle/' + zoom + '/' + x + '/' + y + '.png';
            };
            this.map.addTileLayer(tileLayer);
        },

        initCityCenter: function () {
            //                //各地市marker坐标初始化
            var that = this;
            $.ajax({
                url: actionInfo.url + actionInfo.cityBreak,
                dataType: "json",
                type: "post",
                isShowMask: false,
                success: function (data, status, xhr) {
                    console.info("initCityCenter")
                    console.info(data)
                    if (data.code == 0) {
                        $.each(data.value, function (index, content) {
                            var point = new BMap.Point(content.longitude, content.latitude);
                            that.markers[content.cityId] = that.getMarker(content, point, 1);
                            that.markers2[content.cityId] = that.getMarker(content, point, 2);
                        });
                    }
                }
            });
            //中心点坐标初始化
            this.cMarker = this.getMarker(null, this.map.getCenter, 1);
        },
        mapRefresh: function () {
            if (this.undoAjax) {
                this.undoAjax.abort();
            }
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.clearMarker();
            var self = this;
            self.geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var mk = new BMap.Marker(r.point);
                    self.map.addOverlay(mk);
//                    self.map.panTo(r.point);
//                    alert('您的位置：'+r.point.lng+','+r.point.lat);
                }
                else {
//                    alert('failed'+this.getStatus());
                }
            })
            this.timeout = window.setTimeout(function() {
                self.pageNo = self.pageMax = 1;
                self.getMoTotal();
            }, 1500);

        },
        getMoTotal: function () {
            console.info("getMoTotal");
            var self = this;
            this.moTotal = 0;
            if (!this.type || this.type == "") {
                return;
            }
            this.undoAjax = $.ajax({
                url: actionInfo.url + actionInfo.moCountByBounds,
                type: "post",
                dataType: "json",
                data: this.getParam(),
                isShowMask: false,
                success: function (data, status, xhr) {
                    console.info("查询总数成功");
                    console.info("self.drag:" + self.drag + ",self.zoom:" + self.zoom);
                    if (self.drag || self.zoom) {
                        return;
                    }
                    console.info("展示");
                    console.info(data);
                    if (data.code == 0) {
                        self.moTotal = (data.value)[0].total;
                        //ＴＯＤＯ

                        switch (self.type) {
                            case '1':
                            case '2':
                            case '3':
                            case '4':

                                console.info(self.map.getZoom());

                                //1万以上，撒各地市气泡
                                if (self.moTotal >= 10000) {
//                                    if (self.map.getZoom()<7) {
//                                        self.addCenter();
//                                    }else{
                                        self.addMarker();
//                                    }
                                } else if (self.moTotal < 10000 && self.moTotal >= 5000) {
                                    //1万－5千,撒一个气泡
                                    self.addMarker();
                                } else if (self.moTotal < 5000 && self.moTotal >= 50) {
                                    //5千－50，聚合
                                    self.markerClusterer.setMinClusterSize(100);
                                    self.getMoByPage(2);
                                } else if (self.moTotal < 50) {
                                    //1百以内，聚合但撒点
                                    self.markerClusterer.setMinClusterSize(100);
                                    self.getMoByPage(1);
                                }
                                break;
//                            case '3':
                                //1万以上，撒各地市气泡
//                                if (self.moTotal >= 10000) {
//                                    self.addMarker();
//                                } else if (self.moTotal < 10000 && self.moTotal >= 200) {
//                                    //1万－１千,撒一个气泡
//                                    self.addCenter();
//                                } else if (self.moTotal < 200 && self.moTotal >= 50) {
//                                    //１千－１百，聚合
//                                    self.markerClusterer.setMinClusterSize(2);
//                                    self.getMoByPage();
//                                } else if (self.moTotal < 50) {
//                                    //1百以内，聚合但撒点
//                                    self.markerClusterer.setMinClusterSize(100);
//                                    self.getMoByPage();
//                                }
//                                break;
                        }
                    } else {
                    }
                },
                error: function () {
                }
            });
        },
        getMoByPage: function (i) {
            console.info("getMoByPage");
            this.pageNo = 1;
            this.pageMax = this.getMaxPage();
            this.doMoQuery(i);
        },
        doMoQuery: function (i) {
            if (this.pageNo <= this.pageMax) {
                var self = this;
                var url = actionInfo.url;
                if(i==2){
                    url += actionInfo.MoByBoundsNew;
                }else{
                    url += actionInfo.MoByBounds;
                }
                this.undoAjax = $.ajax({
                    url: url,
                    isShowMask: false,
                    type: "post",
                    dataType: "json",
                    data: this.getParam(this.pageSize, this.pageNo),
                    success: function (data, status, xhr) {
                        if (self.drag || self.zoom || self.touch) {
                            return;
                        }
                        if (data.code == 0) {
                            console.info("before filter:");
                            console.info(data);
                            self.filterdata(data);
                            console.info("after filter:");
                            console.info(data);
                            self.makerClustererRefresh(data);
                            self.pageNo++;
                            self.doMoQuery();
                        } else {
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(textStatus);
                    }
                });
            }
        },
        makerClustererRefresh: function (data) {
            var self = this;
            var markers = [];
            var pt = null;
//            var url;
//            var size = new BMap.Size(53, 53);
//            if (this.type == 1) {
//                url = this._IMAGE_PATH + "0." + this._IMAGE_EXTENSION;
//            } else if (this.type == 2) {
//                url = this._IMAGE_PATH + "2." + this._IMAGE_EXTENSION;
//                size = new BMap.Size(66, 66);
//            } else if (this.type == 3) {
//                url = this._IMAGE_PATH + "0." + this._IMAGE_EXTENSION;
//            } else if (this.type == 4) {
//                url = this._IMAGE_PATH + "1." + this._IMAGE_EXTENSION;
//                size = new BMap.Size(56, 56);
//            }
//            var styles = [
//                {
//                    url: url,
//                    size: new BMap.Size(20, 20)
//                }
//            ];
            if (data.code == 0) {
                if(self.moTotal>50) {
                    $.each(data.value, function (index, content) {
                        pt = new BMap.Point(content.lon, content.lat);
                        var maker = self.getMarker(content, pt, self.type, 1);
                        self.map.addOverlay(maker);
//                    markers.push(maker);
                    });
                }else{
                    $.each(data.value, function (index, content) {
                        pt = new BMap.Point(content.lon, content.lat);
                        var maker = self.getMarker(content, pt, self.type, 1);
                        markers.push(maker);
                    });
//                    console.info(markers);
                    this.markerClusterer.addMarkers(markers);
//                    this.markerClusterer.setStyles(styles);
                }
//                console.info(markers);
//                this.markerClusterer.addMarkers(markers);
//                this.markerClusterer.setStyles(styles);
            }
        },
        getMaxPage: function () {
            if (this.pageSize == 0) {
                return 0;
            } else {
                if (this.moTotal % this.pageSize == 0) {
                    return parseInt(this.moTotal / this.pageSize);
                } else {
                    return parseInt(this.moTotal / this.pageSize) + 1;
                }
            }
        },

        getMarker: function (obj, point, type, size) {// 创建图标对象
            var self = this;
            var myIcon;
            var infoWindow;
            if (size == 1) {
                if(obj.num==1||self.moTotal<=50){
                    myIcon = this.getSmallIcon(type);
                }else if(obj.num>1||self.moTotal>50){
                    myIcon = this.getIcon(type);
                }
                if (obj && obj.mtype) {
                    var imageUrl = '';
                    var color = (type == '2') ? 'red' : 'blue';
                    switch (obj.mtype) {
                        case 16:
                            imageUrl = "images/2g-" + color + ".png";
                            break;
                        case 28:
                            imageUrl = "images/3g-" + color + ".png";
                            break;
                        case 103:
                            imageUrl = "images/4g-" + color + ".png";
                            break;
                    }
                    if (imageUrl != '') {
                        myIcon = new BMap.Icon(imageUrl, new BMap.Size(20, 20), {
                        });
                    }
                    infoWindow = new BMap.InfoWindow(obj.mname, {
//                        offset: new BMap.Size(0, -70),
                        //height:50,
                        //width:150,//信息窗口宽度height:100,//信息窗口高度
                        title: '详情'//信息窗口标题
                    });
                    //创建信息窗口对象
                }
            } else {
                myIcon = this.getIcon(type);
            }
            // 创建标注对象并添加到地图
            var marker = new BMap.Marker(point, {
                icon: myIcon
            });
            marker.enableDragging();
            if(obj && obj.num && obj.num>1){
                var labellength=obj.num.toString().length;
                var label = new BMap.Label(obj.num, {
//                    offset: new BMap.Size(myIcon.size.width/2-labellength*3.5, myIcon.size.height/2-12)
                    offset: new BMap.Size(myIcon.size.width/2-labellength*3.5, myIcon.size.height/2-6)
                });
                label.setStyle({
                    border: "0px",
                    "background-color": "transparent",
                    "color": "white",
                    "text-align": "center"
                });
                marker.setLabel(label);
            }
            if (infoWindow) {
                marker.addEventListener("click", function (e) {
                    self.map.openInfoWindow(infoWindow, e.currentTarget.point);
                    //打开信息窗口
                });
            }
            return marker;
        },
        change_search_map: function () {
            this.keyWord = $("#search_map").val();
            this.queryShow();
            $('.mask_map2').show();
            $("#search_drop_down").animate({
                height: '201px'
            });
        },
        click_search_map: function () {
            this.showSearchResult(true);
        },
        click_px: function () {
            $('#search_btn').show();
        },
        click_search_map_btn: function () {
            this.keyWord = $("#search_map").val();
            this.queryShow();
        },
        click_search_drop_down: function () {
            this.showSearchResult(false);
        },
        click_search_drop_down_a: function (param) {
            $("#search_map").val($(param.toElement).text());
            this.showSearchResult(false);
            var mo = this.searchResult[$(param.toElement).attr("rid")];
            console.info(this.searchResult)
            console.info($(param.toElement).attr("rid"))
            console.info(mo)
            var hisarray = localStorage.getItem("gis.querys") != null ? JSON.parse(localStorage.getItem("gis.querys")) : [];
            var isexist = false;
            $.each(hisarray, function (i, n) {
                if (n.mname == mo.mname) {
                    isexist = true;
                }
            });
            if (!isexist) {
                hisarray.push(mo);
            }
            if (hisarray.length > 5) {
                hisarray.shift();
            }
            localStorage.setItem("gis.querys", JSON.stringify(hisarray));
            this.clearMarker();
            var point = new BMap.Point(mo.lon, mo.lat);
            this.map.addOverlay(this.getMarker(mo, point, mo.mtype==85?'3':'1', 1));
            this.map.panTo(new BMap.Point(mo.lon, parseFloat(mo.lat)+0.3));

        },
        showSearchResult: function (visible) {
            if (visible) {
                $("#search_drop_down a").remove();
                console.info(this.searchResult)
                for (var i = 0; i < this.queryLength && i < this.searchResult.length; i++) {
                    try {
                        $("#search_drop_down").append("<a rid=" + i + ">" + this.searchResult[i].mname + "</a>");
                    } catch (e) {
                        console.error(e)
                    }
                }
                $('.mask_map2').show();
                $("#search_drop_down").animate({
                    height: '201px'
                });
            } else {
                $('.mask_map2').hide();
                $("#search_drop_down").animate({
                    height: '0'
                });
            }


        },
        queryShow: function () {
            this.queryflag = true;
            var that = this;
            if (this.searchInfoWindow) {
                this.searchInfoWindow.close();
            }
            if (this.undoAjax) {
                this.undoAjax.abort();
            }
            if(this.keyWord==""){
                return;
            }
            console.info(this.keyWord)
            this.undoAjax = $.ajax({
                url: actionInfo.url + actionInfo.MoByBounds,
                type: "post",
                dataType: "json",
                isShowMask: false,
                data: this.getParam(5, 1, this.keyWord),
                success: function (data, status, xhr) {
                    if (that.drag || that.zoom) {
                        return;
                    }
                    console.info(data);
                    if (data.code == 0) {
                        that.searchResult = data.value;
                        that.showSearchResult(true);
                    } else {
                    }
                },
                error: function () {
                }
            });
        },
        getSmallIcon: function (type) {
            var imgurl;
            switch (type) {
                case "1":
                    imgurl = "images/icon_dingwei.png";
                    break;
                case "2":
                    imgurl = "images/icon_dingwei-hong.png";
                    break;
                case "3":
                    imgurl = "images/icon_dingwei.png";
                    break;
                case "4":
                    imgurl = "images/icon_dingwei-huang.png";
                    break;
            }
            var myIcon = new BMap.Icon(imgurl, new BMap.Size(20, 25), {
//                anchor: new BMap.Size(0, 80)
            });
            return myIcon;
        },
        getBigIcon: function (type) {
            var imgurl;
            if (type == "2" || type == "4") {
                imgurl = "images/red_90.png";
            } else {
                imgurl = "images/blue_90.png";
            }
            var myIcon = new BMap.Icon(imgurl, new BMap.Size(90, 89), {
//                anchor: new BMap.Size(90/2, 89)
                imageSize:new BMap.Size(90, 89)
            });
            return myIcon;
        },
        getIcon: function (type) {
            var imgurl;
            if (type == "2" || type == "4") {
                imgurl = "images/red_66.png";
            } else {
                imgurl = "images/blue_66.png";
            }
            var myIcon = new BMap.Icon(imgurl, new BMap.Size(50, 50), {
                // 指定定位位置。
                // 当标注显示在地图上时，其所指向的地理位置距离图标左上
                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
                // 图标中央下端的尖角位置。
//                anchor: new BMap.Size(66/2, 65)
                imageSize:new BMap.Size(50, 50)
                // 设置图片偏移。
                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
                // 需要指定大图的偏移位置，此做法与css sprites技术类似。
                //        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
            });
            return myIcon;
        },
        getParam: function (rows, pageno, keyWord) {
            var bounds = this.map.getBounds();
            var center = bounds.getCenter();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            var param = {};
            var m_type = "";
            var mtype = [];

            if (this.type == 1) {
                if (this.selectG.s2G.selected) {
                    mtype.push(this.selectG.s2G.value);
                }
                if (this.selectG.s3G.selected) {
                    mtype.push(this.selectG.s3G.value);
                }
                if (this.selectG.s4G.selected) {
                    mtype.push(this.selectG.s4G.value);
                }
            } else if (this.type == 2) {
                if (this.selectG.d2G.selected) {
                    mtype.push(this.selectG.d2G.value);
                }
                if (this.selectG.d3G.selected) {
                    mtype.push(this.selectG.d3G.value);
                }
                if (this.selectG.d4G.selected) {
                    mtype.push(this.selectG.d4G.value);
                }
            } else if (this.type == 3) {
                mtype.push("85");
            }
            if (keyWord == "" || keyWord == null || keyWord == undefined) {
                keyWord = "";
            }
            m_type = mtype.join(",");

            if(m_type==""){
                m_type="-1";//不选择类型时为了查询不到结果
            }
            param = {
                "type": this.type,
                "moType": m_type,
                "swlng": sw.lng,
                "swlat": sw.lat,
                "nelng": ne.lng,
                "nelat": ne.lat,
                "rows": rows,
                "page": pageno,
                "x":4,
                "y":2,
                "keyWord": encodeURI(keyWord)
            };
            return param;
        },
        addCenter: function () {
            var that = this;
            var bounds = this.map.getBounds();
            var center = bounds.getCenter();
            if (!this.type || this.type == "") {
                return;
            }
            this.undoAjax = $.ajax({
                url: actionInfo.url + actionInfo.moCountByBounds,
                type: "post",
                dataType: "json",
                isShowMask: false,
                data: this.getParam(),
                success: function (data, status, xhr) {
                    if (data.code == 0) {
                        var num = (data.value)[0].total;
                        that.refreshflag = true;
                        var myIcon = that.getBigIcon(that.type);
                        that.cMarker.setIcon(myIcon);
                        that.cMarker.setPosition(that.map.getZoom()<7?that.markers2["01"].getPosition():center);
                        console.info(myIcon.size.width);
                        var labellength=(data.value)[0].total.toString().length;
                        var label = new BMap.Label((data.value)[0].total, {
                            offset: new BMap.Size(myIcon.size.width/2-labellength*3.5, myIcon.size.height/2-12)
                        });
                        label.setStyle({
                            border: "0px",
                            "background-color": "transparent",
                            "color": "white",
                            "text-align": "center"
                        });
                        that.cMarker.setLabel(label);
                        that.map.addOverlay(that.cMarker);
                    } else {
                    }
                },
                error: function () {
                }
            });
        },
        addMarker: function () {
            this.queryflag = false;
            var that = this;
            if (!this.type || this.type == "") {
                return;
            }
            this.undoAjax = $.ajax({
                url: actionInfo.url + actionInfo.moCount,
                type: "post",
                dataType: "json",
                isShowMask: false,
                data: this.getParam(),
                success: function (data, status, xhr) {
                    if (data.code == 0) {
                        $.each(data.value, function (index, content) {
                            var labeltotal = 0;
                            if (content["16"] != undefined) {
                                labeltotal += Number(content["16"]);
                            }
                            if (content["28"] != undefined) {
                                labeltotal += Number(content["28"]);
                            }
                            if (content["103"] != undefined) {
                                labeltotal += Number(content["103"]);
                            }

                            if (content["85"] != undefined) {
                                labeltotal += Number(content["85"]);
                            }
                            var marker=null;
                            if (that.type == "2") {
                                marker =  that.markers2[content.cityId];
                            }else{
                                marker =  that.markers[content.cityId];
                            }
                            var myIcon = marker.getIcon();
                            var labellength=labeltotal.toString().length;
                            var label = new BMap.Label(labeltotal, {
                                offset: new BMap.Size(myIcon.size.width/2-labellength*3.5, myIcon.size.height/2-8)
                            });
                            label.setStyle({
                                border: "0px",
                                "background-color": "transparent",
                                "color": "white",
                                "text-align": "center"
                            });
                            marker.setLabel(label);
                            that.map.addOverlay(marker);
                        });
                    } else {
                    }
                },
                error: function () {
                }
            });
        },
        clearMarker: function () {
            this.markerClusterer.clearMarkers();
            if(!this.locationFlag) {
                this.map.clearOverlays();
            }else{
            this.locationFlag=false;
            }
        },
        //单击热点图层
        hotspotclick: function (e, that) {
            console.info(e);
            var customPoi = e.customPoi;
            // poi的默认字段
            var contentPoi = e.content;
            // poi的自定义字段
            var content = '<p style="width:280px;margin:0;line-height:20px;">地址：' + customPoi.address + '<br/>' + '</p>';
            if (contentPoi.alarm_title) {
                content += '<p style="width:280px;margin:0;line-height:20px;">断服原因：' + contentPoi.alarm_title + '<br/>' + '</p>';
            }
            that.searchInfoWindow = new BMapLib.SearchInfoWindow(that.map, content, {
                title: customPoi.title, // 标题
                width: 290, // 宽度
                height: 40, // 高度
                panel: "panel", // 检索结果面板
                enableAutoPan: true, // 自动平移
                enableSendToPhone: false, // 是否显示发送到手机按钮
                searchTypes: [
                    // BMAPLIB_TAB_SEARCH, //周边检索
                    // BMAPLIB_TAB_TO_HERE, //到这里去
                    // BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            });
            var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
            that.searchInfoWindow.open(point);
        },
        filterdata:function(data){
            if(this.type == 2)
            {
                var oldValue=data.value;
                var self=this;
                var newValue=[];
                data.value=newValue;

                $.each(oldValue, function (i, item){
                    if(item.mtype){
                        if(self.selectG.d2G.selected&&(item.mtype==self.selectG.d2G.value)){
                            newValue.push(item);
                        }else
                        if(self.selectG.d3G.selected&&(item.mtype==self.selectG.d3G.value)){
                            newValue.push(item);
                        }else
                        if(self.selectG.d4G.selected&&(item.mtype==self.selectG.d4G.value)){
                            newValue.push(item);
                        }
                    }else{
                        newValue.push(item);
                    }

                })
            }

        },
        render: function () {
            this.$el.append(this.template({
                "type": this.type,
                "selectG": this.selectG
            }));
            return this;
        }
    });
    return GisTwoView;
}); 