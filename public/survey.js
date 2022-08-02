// const SURVEY_ID = 1;
var surveyID;

Survey
    .StylesManager
    .applyTheme("modern");

function sendResults(sender) {
    let results = JSON.stringify(sender.data);
    console.log(results);
    $.ajax({
        type: 'POST',
        url: '/send',
        data: {
            "results": results
        },
        success: function (data) {
            console.log("data sent");
            console.log(data);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

function generateSurvey(title) {
    $.ajax({
        type: 'POST',
        url: '/surveyNames',
        data: {
            "title": title
        },
        success: function (data) {
            surveyID = data[0].names;
            console.log(surveyID)
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
    $.ajax({
        type: 'POST',
        url: '/surveyType',
        data: {
            "title": title
        },
        async: false
    });
    $.ajax({
        type: 'POST',
        url: '/surveys',
        data: {
            "title": title
        },
        success: function (data) {
            var surveyJson = data[0].title;
            var survey = new Survey.Model(surveyJson);
            survey.onComplete.add(sendResults);

            $("#container").Survey({ model: survey });
            mainTitle = surveyJson.title;
            console.log(surveyJson);
            jsonLooper(surveyJson);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
}

$("body").on("click", "#boje", function () {
    titles = [];
    generateSurvey("Boje");
});
$("body").on("click", "#motor", function () {
    titles = [];
    generateSurvey("Motori");
});
$("body").on("click", "#ubija", function () {
    titles = [];
    generateSurvey("Promaja");
});
$("body").on("click", "#zivot", function () {
    titles = [];
    generateSurvey("Ludnica");
});
$("body").on("click", "#predmeti", function () {
    titles = [];
    generateSurvey("Predmeti");
});
$("body").on("click", "#skolovanje", function () {
    titles = [];
    generateSurvey("Školovanje");
});

$("body").on("click", "#nova", function () {
    var output = '<div><br><label for="novaAnketa">Zalijepite JSON tekst za anketu:</label>';
    output += '<br><textarea id="novaAnketa" name="novaAnketa" rows="40" cols="75"></textarea>';
    output += '<br><button id="saveJSON">Spremi</button>';
    $("#container").html(output);
});
$("body").on("click", "#saveJSON", function () {
    $.ajax({
        type: 'POST',
        url: '/insertSurvey',
        data: {
            "survey": $('#novaAnketa').val()
        },
        success: function (data) {
            $("#container").html("<br>Anketa spremljena!");
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: false
    });
});