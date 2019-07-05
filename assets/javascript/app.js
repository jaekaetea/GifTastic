var animals = ["cat", "dog", "rabbit", "hamster", "skunk",
"goldfish", "bird", "ferret", "turtle", "sugar glider", 
"chinchilla", "hedgehog", "hermit crab", "gerbil", 
"pygmy goat", "chicken", "capybara", "teacup pig", "serval",
"salamander", "frog"];

var fACount = 0;
var fAnimals = [];

function btnCreation() {
    $(".buttons").html("");
    animals.forEach(function(element, index) {
        var aBtn = $("<button>");
        aBtn.attr("data-noun", element);
        aBtn.attr("class", "btn btn-info");
        aBtn.text(element);
        
        $(".buttons").append(aBtn);
    });
}

function favCreation() {
    $(".favorites").html("");
    fAnimals.forEach(function(element, index) {
        var aBtn = $("<button>");
        aBtn.attr("data-noun", element);
        aBtn.attr("class", "btn btn-info");
        var space = "     ";
        aBtn.text(element+space);
        
        var check = $("<button>");
        //check.attr("data-noun", index);
        check.addClass("checkbox");
        check.text("X");
        check.css("color", "red");
        aBtn = aBtn.append(check);
        
        $(".favorites").append(aBtn);
    });
}

$(document).ready(function() {
    $("#wrong").css("display", "none");
    btnCreation();
    fAnimals = JSON.parse(localStorage.getItem("fAnimals"));

    if (!Array.isArray(fAnimals)) {
        fAnimals = [];
    }
    favCreation();


function renderPics() {
    $("#wrong").css("display", "none");
    if ($(this).text() == "Clear" || $(this).text() == "Submit" || $(this).text() == "X") {
        console.log($(this).text());
        return false;
    } else {
        var aURL = $(this).attr("data-noun");
        //aURL = aURL.trim();
        console.log(aURL);
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
        aURL + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            var results = response.data;
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    var gifDiv = $("<div>");
                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating);
                    $(p).css("font-weight", "bold");
                    var gif = $("<img>");
                    $(gif).css("margin", "0 20px 20px 0");
                    $(gif).css("height", "200px");
                    $(gif).attr("src", results[i].images.fixed_height_still.url);
                    $(gif).attr("data-still", results[i].images.fixed_height_still.url);
                    $(gif).attr("data-animate", results[i].images.fixed_height.url);
                    $(gif).attr("data-state", "still");
                    $(gif).attr("class", "gif");
                    $(gifDiv).css("float", "left");
                    $(gifDiv).append(p);
                    $(gifDiv).append(gif); //Instruction 5 says "Under every gif, display its rating" but video shows above

                    $("#gifs-appear-here").prepend(gifDiv);
                }
            }
            addNews(aURL); 
        }); 
    }
};

function addNews(aURL) {
    $("#well-section").html("");
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M&q=10+" + aURL;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(NYTData) {
        for (var i = 0; i < 3; i++) {
            var articleCounter = i;
            articleCounter++;
            var wellSection = $("<div>");
            wellSection.addClass("well");
            wellSection.attr("id", "article-well-" + articleCounter);
            $("#well-section").append(wellSection);

            if (NYTData.response.docs[i].headline !== "null") {
                $("#article-well-" + articleCounter)
                    .append(
                    "<h4 class='articleHeadline'><span class='label label-primary'>" +
                    articleCounter + ") </span><strong> " +
                    NYTData.response.docs[i].headline.main + "</strong></h4>"
                );
            }
            if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.original) {
                $("#article-well-" + articleCounter)
                  .append("<h6>" + NYTData.response.docs[i].byline.original + "</h6>");
            }
            $("#article-well-" + articleCounter)
                .append("<h6>Section: " + NYTData.response.docs[i].section_name + "</h6>");
            $("#article-well-" + articleCounter)
                .append("<h6>" + NYTData.response.docs[i].pub_date + "</h6>");
            $("#article-well-" + articleCounter)
                .append(
                  "<a href='" + NYTData.response.docs[i].web_url + "'>" +
                  NYTData.response.docs[i].web_url + "</a><br>"
            );
        }
    });
}

function changeState() {
    $("#wrong").css("display", "none");
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
};

function addButton() {
    event.preventDefault();
    var animal = $("#animal").val().trim();
    var aURL = animal;
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
    aURL + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var results = response.data;
        var test = parseInt(response.data.length);
        console.log(test);
        if (test === 0) {
            $("#animal").val("");
            $("input[type=checkbox]").prop("checked", false);
            $("#wrong").show();
        }
        else {
            $("#wrong").css("display", "none");
            addButton2(animal);
        }
    });
};

function addButton2(animal) {
    if ($("input[type=checkbox]").prop("checked")) {
        //alert("yasss");
        $("input[type=checkbox]").prop("checked", false);
        fAnimals.push(animal);
        localStorage.setItem("fAnimals", JSON.stringify(fAnimals));
        favCreation();
    } else {
        animals.push(animal);
        btnCreation();
    }
    $("#animal").val("");
    //WHY WOULD THE PAGE REFRESH WITHOUT THIS LINE!? JUST WHY?!
    return false;
};

function clear() {
    $("#wrong").css("display", "none");
    $("#gifs-appear-here").html("");
    $("#well-section").html("");
};

$(document).on("click", ".checkbox", function() {
    var aF = $(this).attr("data-noun");
    fAnimals.splice(aF, 1);
    favCreation();
    localStorage.setItem("fAnimals", JSON.stringify(fAnimals));
});

$(document).on("click", ".gif", changeState);

$(document).on("click", "#clear", clear);

$(document).on("click", "button", renderPics);

$(document).on("click", "#submit", addButton);
});

