const labels = [];
const backgroundColor = [];
const titles = [];



jsonLooper(surveyJson);
function jsonLooper(obj) {
    for (let k in obj) {
        if (k == "title" && obj[k] != surveyJson.title) {
            titles.push(obj[k]);
        }
        if (k == "text") {
            labels.push(obj[k]);
        }
        if (k == "value") {
            backgroundColor.push(obj[k])
        }
        if (typeof obj[k] === "object") {
            jsonLooper(obj[k])
        }
    }
}
var chartType;

if(backgroundColor.length>5){
    chartType="bar";
}
else{
    chartType="doughnut";
}
function drawChart(chartTitle, index, key) {
    var response;
    $.ajax({
        type: 'POST',
        url: '/results',
        data: {
            "key": key
        },
        success: function (data) {
            response = data;
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });

    var counts = [];
    $.each(response, function () {
        counts[this.name] = this.count;
    });

    var colorCounts = [];
    $.each(backgroundColor, function () {
        colorCounts.push(counts[this]);
    });

    const data = {
        labels: labels,
        datasets: [{
            label: 'Broj odabira',
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            data: colorCounts
        }]
    };
    const config = {
        type: chartType,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 48
                    }
                },
                legend: {
                    display: true
                }
            }
        }
    };

    $("#container").append('<canvas id="chartContainer'+index+'"></canvas>');
    const myChart = new Chart(document.getElementById('chartContainer' + index), config);
}
$("body").on("click", "#chart", function () {
    $("#container").html("");
    for (var i = 0; i < titles.length; i++) {
        drawChart(titles[i], i, "nebo");
    }
});

