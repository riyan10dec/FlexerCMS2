//import * as echarts from './lib/echarts.min'
  var GaugeChart = function(gaugeConfig){
    var echarts = require('echarts');
    var myChart = echarts.init(document.getElementById('gaugeChart'));
    let option = {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show: false,
            feature: {
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        series : [
            {
                name: 'Key/H',
                type: 'gauge',
                z: 3,
                min: 0,
                max: gaugeConfig.maxKeystroke,
                splitNumber: 10,
                radius: '100%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 2,
                        color:[ [1, '#ffffff']]
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    backgroundColor: '',
                    borderRadius: 2,
                    color: '#eee',
                    padding: 3,
                    textShadowBlur: 2,
                    textShadowOffsetX: 1,
                    textShadowOffsetY: 1,
                    textShadowColor: '#222'
                },
                title : {
                    fontSize: 15,
                    color: 'white'
                },
                itemStyle: {
                    normal: {
                        color: 'yellow'
                    }
                },
                detail : {
                    show: true,
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    formatter: function (value) {
                        return originalValue1;
                    },
                    fontSize: 15,
                    fontWeight: 'bolder',
                    color: 'yellow'
                    // fontWeight: 'bolder',
                    // borderRadius: 3,
                    // backgroundColor: '#444',
                    // borderColor: '#aaa',
                    // shadowBlur: 5,
                    // shadowColor: '#333',
                    // shadowOffsetX: 0,
                    // shadowOffsetY: 3,
                    // borderWidth: 2,
                    // textBorderColor: '#000',
                    // textBorderWidth: 2,
                    // textShadowBlur: 2,
                    // textShadowColor: '#fff',
                    // textShadowOffsetX: 0,
                    // textShadowOffsetY: 0,
                    // fontFamily: 'Arial',
                    // width: 100,
                    // color: '#eee',
                    // rich: {}
                },
                pointer: {
                    width: 2
                },
                data:[{value: gaugeConfig.keystroke, name: 'k/h'}]
            },
            {
                name: 'Click/H',
                type: 'gauge',
                center: ['15%', '55%'],    // 默认全局居中
                radius: '60%',
                min:0,
                max: gaugeConfig.maxMouseclick,
                endAngle:45,
                splitNumber:5,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 2,
                        color:[ [1, '#ffffff']]
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'FFE81C',
                        fontSize: '10px'
                    }
                },
                splitLine: {           // 分隔线
                    length:15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:2
                },
                title: {
                    fontSize: 15,
                    color: 'white',
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                },
                itemStyle: {
                    normal: {
                        color: 'yellow'
                    }
                },
                axisLabel: {
                    fontSize: 8
                },
                detail: {
                    formatter: function (value) {
                        return originalValue2;
                    },
                    show: true,
                    fontSize: 15,
                    fontWeight: 'bolder',
                    color: 'yellow'
                },
                data:[{value: gaugeConfig.mouseclick, name: 'c/h'}]
            },
        ]
    };
    var originalValue1= gaugeConfig.keystroke;
    var originalValue2= gaugeConfig.mouseclick;
    var direction = [1,-1,-1,1];
    var counter = 0;
    var data = 0;
    var spread = 0;
    var multiplier = 0.025;
    setInterval(function (){
        if(option.series[0].data[0].value > option.series[0].data[0].max )
            option.series[0].data[0].value = option.series[0].data[0].max;
        
        if(option.series[1].data[0].value > option.series[0].data[0].max )
            option.series[1].data[0].value = option.series[0].data[0].max;
        data = option.series[0].data[0].value;
        spread = (option.series[0].max - option.series[0].min) * multiplier;
        option.series[0].data[0].value = direction[counter] == 0 ? data : direction[counter] > 0 ? data - spread : data + spread;

        data = option.series[1].data[0].value;
        spread = (option.series[1].max - option.series[1].min) * multiplier;
        option.series[1].data[0].value = direction[counter] == 0 ? data : direction[counter] > 0 ? data - spread : data + spread;

        if(counter < direction.length - 1) {
            counter++;
        } else {
            counter = 0;
        }

        myChart.setOption(option,true);
    },50);
}

module.exports = GaugeChart;