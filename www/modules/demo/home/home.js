/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone','iscroll', 'text!modules/demo/home/viewTemplate.html', 'bmap', 'bmaplib'], function ($, _, Backbone,IScroll, viewTemplate,BMap, BMapLib) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        id:"demo-page",
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide"
        },
        initialize: function (options) {

        },
        pageHide:function(){
            console.info("page hide...")
        },
        pageShow:function(){
//                $( document ).on( "swipeleft swiperight", "#demo-page", function( e ) {
//                    // We check if there is no open panel on the page because otherwise
//                    // a swipe to close the left panel would also open the right panel (and v.v.).
//                    // We do this by checking the data that the framework stores on the page element (panel: open).
//                    if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
//                        if ( e.type === "swipeleft" ) {
//                            $( "#right-panel" ).panel( "open" );
//                        } else if ( e.type === "swiperight" ) {
//                            $( "#left-panel" ).panel( "open" );
//                        }
//                    }
//                });


            this.map = new BMap.Map("mapContainer");
            this.addTileLayer();
//            this.map.centerAndZoom("江苏", 9);
            // 初始化地图，设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom();
            this.map.addControl(new BMap.NavigationControl());
            // 添加默认缩放平移控件
            // 添加定位控件
            var geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener("locationSuccess", function (e) {
                // 定位成功事件
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
            this.map.addControl(geolocationControl);


            var point = new BMap.Point(119.2112, 32.1223);
            var myIcon = new BMap.Icon("images/4g-red.png", new BMap.Size(20, 20), {});
            var marker = new BMap.Marker(point, {
                icon: myIcon,
                enableDragging:true
            });
            this.map.addOverlay(marker);

            var that=this;
            setTimeout(function(){
                that.getBoundary();
            }, 2000);

        },
        getBoundary : function getBoundary(){
            var that = this;
        var bdary = new BMap.Boundary();
            console.info("----------->")
        bdary.get("南京市江宁区", function(rs){       //获取行政区域
//            that.map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                that.map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            that.map.setViewport(pointArray);    //调整视野
        });
    },


        addTileLayer:function(){
            var tileLayer = new BMap.TileLayer({
                isTransparentPng : true
            });
            tileLayer.getTilesUrl = function(tileCoord, zoom) {
                var x = tileCoord.x;
                var y = tileCoord.y;
                console.info("-------------------------" + 'maptitle/' + zoom + '/' + x + '/' + y + '.jpg');
                return 'maptitle/' + zoom + '/' + x + '/' + y + '.jpg';
            };
            this.map.addTileLayer(tileLayer);
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});