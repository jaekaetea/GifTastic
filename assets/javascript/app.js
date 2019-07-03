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
        aBtn.text(element);
        
        $(".favorites").append(aBtn);
    });
}

$(document).ready(function() {
    btnCreation();

function renderPics() {
    //alert($(this).text());
    if ($(this).text() != "Clear" && $(this).text() != "Submit") {
    var aURL = $(this).attr("data-noun");
    console.log(aURL);
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
    aURL + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var results = response.data;
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
    }); }
};

function changeState() {
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
    if ($("input[type=checkbox]").prop("checked")) {
        //alert("yasss");
        $("input[type=checkbox]").prop("checked", false);
        fAnimals.push(animal);
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
    $("#gifs-appear-here").html("");
};
/*
function renderFav() {
    $(".favorites").empty();

    var fAnimals = 
}*/

$(document).on("click", ".gif", changeState);

$(document).on("click", "#clear", clear);

$(document).on("click", "button", renderPics);

$(document).on("click", "#submit", addButton);
/*
$(document.body).on("click", ".xBox", function() {
    var aNUmber = $(this).attr("data-noun");
    $("#data-noun" + number).remove();
});
*/
});
