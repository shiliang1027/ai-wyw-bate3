/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery'], function ($) {

    var charts=[];
    var getArrXY= function(obj) {
        var arrX = []; // x轴数组
        var arrY = []; // y轴数组
        var nameY = {};
        var retObj = {};
        var maxlen = 0;
        $.each(obj.list, function(i, val){
            var v = val.v;
            if (v && maxlen < v.length) { //av
                maxlen = v.length; //av
            }
        });
        $.each(obj.list, function(i, val){
            // 处理x轴,x轴为1点,1日时,去掉点和日
            var k = val.k;
            if (/[0-9]+[点日]/.test(k)) {
                k = /[0-9]+/.exec(k);
            }
            arrX.push(k);

            // 处理y轴
            var v = val.v;
            // 成功率
            if (obj.kind == 2) {
                nameY = "单位(%)";
                arrY.push(parseFloat(v.replace("%", "")));
            }
            // 数量
            else if (obj.kind == 1) {
                nameY = "单位";
                if (maxlen >= 5) {
                    nameY += "(万)";
                }
                arrY.push(parseFloat(v));
            }
        });
        retObj.nameY = nameY;
        retObj.arrY = arrY;
        retObj.arrX = arrX;
        return retObj;
    };
    /**
     * object 为undefined,null,{}的验证
     */
    var isNull=function(obj) {
        if (!obj) {
            return true;
        }
        for (var name in obj) {
            return false;
        }
        return true;
    };
    /**
     * kpi指数  统计折线图
     */
    var buildChart=function(nodeid, retObj, dir, name){
        if (isNull(retObj) || !retObj.list || retObj.list.length == 0) { return;}
        var obj = {};
        try{
            obj = getArrXY(retObj);
        }catch (e) {
            return;
        }
        var arrX = obj.arrX; // x轴数组
        var arrY = obj.arrY; // y轴数组
        var nameY = obj.nameY;

        require(
            [
                'echarts3/echarts.min'
            ],
            function(ec){
                var myChart  = ec.init(document.getElementById(nodeid));
                charts.push({"node":nodeid,"chart":myChart});
                option = {
//                title:{
//                    text: retObj.st,
//                    textStyle:{
//                        fontSize:5
//                    }
//                },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b}:{c}"
                    },
                    legend: {
                        data:[{
                            name : name,
                            textStyle:{
                                fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                fontWeight: 'normal'
                                //fontSize: 18

                            }
                        }]
                    },
                    grid:{
                        x: 45,
                        x2: 35,
                        y2: 30,
                        y: 40,
                        borderWidth: 0
                    },
                    toolbox: {
                        show : false,
                        padding: [5, 25, 5, 5],
                        feature : {
                            // mark : {show: true},
                            // dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true}
                            //saveAsImage : {show: true}
                        }
                    },
                    calculable : false,
                    animation:false,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : arrX,
                            axisLabel: {
                                textStyle: {
                                    fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                    fontWeight: 'normal'
                                    //fontSize: 18
                                }
                            },
                            splitLine: {show : false},
                            axisLine:{
                                lineStyle: {
                                    color: '#cccccc'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : nameY,
                            type : 'value',
                            scale: true,
                            axisLabel : {
                                formatter: function(value) {
                                    if (nameY.indexOf("(万)") != -1) {
                                        return value/10000;
                                    }
                                    else {
                                        return value;
                                    }},
                                textStyle: {
                                    fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                    fontWeight: 'normal'
                                    //fontSize: 14
                                }
                            },
                            splitLine: {   lineStyle:{
                                width: 0.5,
                                type: 'solid'
                            }
                            },
                            axisLine:{
                                lineStyle: {
                                    color: '#cccccc'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name: name,
                            type: 'line',
                            data: arrY,
                            smooth: true,
//            	            markPoint : {
//            	                data : [
//            	                    {type : 'max', name: '最大值'},
//            	                    {type : 'min', name: '最小值'}
//            	                ]
//            	            },
                            markLine : {
                                itemStyle:{
                                    normal:{
                                        label:{show:true,
                                            position: 'top'}
                                    }
                                },
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option,true);
            });
    };

    var buildChartKpi5=function(nodeid, retObj, dir, name){
        if (isNull(retObj) || !retObj.list || retObj.list.length == 0) { return;}
        var arrX = []; // x轴数组
        var arrY1 = []; // y轴数组
        $.each(retObj.list, function(i, val){
            arrX.push(val.k);
            arrY1.push(parseFloat(val.v1 || val.v));
        });

        require(
            [
                'echarts3/echarts.min'
            ],
            function(ec){
                var myChart  = ec.init(document.getElementById(nodeid));
                charts.push({"node":nodeid,"chart":myChart});
                option = {
//                title:{
//                    text: retObj.st,
//                    textStyle:{
//                        fontSize:5
//                    }
//                },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b}:{c}"
                    },
                    legend: {
                        data:[
                            {
                                name : name,
                                textStyle:{
                                    fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                    fontWeight: 'normal'
                                    //fontSize: 18
                                }}
                        ]
                    },
                    grid:{
                        x: 45,
                        x2: 35,
                        y2: 30,
                        y: 40,
                        borderWidth: 0
                    },
                    toolbox: {
                        show : false,
                        padding: [5, 25, 5, 5],
                        feature : {
                            // mark : {show: true},
                            // dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true}
                            //saveAsImage : {show: true}
                        }
                    },
                    calculable : false,
                    animation:false,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : arrX,
                            axisLabel: {
                                textStyle: {
                                    fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                    fontWeight: 'normal'
                                    //fontSize: 18
                                }
                            },
                            splitLine: {show : false},
                            axisLine:{
                                lineStyle: {
                                    color: '#cccccc'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '单位(%)',
                            scale: true,
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            },
                            axisLabel: {
                                textStyle: {
                                    fontFamily:'Microsoft Yahei, Helvetica, sans-serif',
                                    fontWeight: 'normal'
                                    //fontSize: 14
                                }
                            },
                            splitLine: {   lineStyle:{
                                width: 0.5,
                                type: 'solid'
                            }
                            },
                            axisLine:{
                                lineStyle: {
                                    color: '#cccccc'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name: name,
                            type: 'line',
                            data: arrY1,
                            smooth: true,
                            markLine : {
                                itemStyle:{
                                    normal:{
                                        label:{show:true,
                                            position: 'top'}
                                    }
                                },
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option,true);
            });
   };

    var clear=function(nodeids){
        $.each(charts,function(i,n){
            if(nodeids.indexOf(n.node)!=-1){
                try{
                    n.chart.clear();
                    n.chart.dispose();
                }catch(e){
                    console.error(e);
                }
            }

        });
        charts=[];
    };
    return {
        buildChartKpi5:buildChartKpi5,
        buildChart:buildChart,
        clear:clear
    };
});