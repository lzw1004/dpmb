function createCircle(proval, id) {
    let val = $(id).width() - 8;
    let height = $(id).height() - 8;
    // val = val - 20;
    $(id).circleProgress({
        value: proval,
        size: val > height ? height : val,
        startAngle: -Math.PI * 0.5,
        fill: {
            // gradient: ['#3aeabb', '#fdd250'],
            // gradient: ['#3381ed', '#03d3fb'],
            gradient: ['#03d3fb', '#3381ed'],
        },
        emptyFill: 'rgb(41,44,62)',
        // 圆环的宽度，默认为1/4的大小
        thickness: '1.6',
        reverse: false,
    });
}

createCircle(0.5, circle1);
