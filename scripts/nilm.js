var nameTranlations = [["T", "Total Home"],
                       ["H", "HVAC"],
                       ["K", "Kitchen"],
                       ["C", "Clothes"],
                       ["O", "Home Office"],
                       ["E", "Media/TV"],
                       ["R", "Other"],
                       ["U", "Unmetered"]];

var context = cubism.context()
    .serverDelay(30000)
    .clientDelay(30000)
    .step(60000)
    .size(960);

var measure = "inst"

var eAll = getMeasures(0, measure),
    eHVAC = getMeasures(1, measure),
    eKitchen = getMeasures(2, measure),
    eClothes = getMeasures(3, measure),
    eComputer = getMeasures(4, measure),
    eMediaTV = getMeasures(5, measure),
    eOther = getMeasures(6, measure),
    eUnmetered = getMeasures(7, measure);

function getMeasures(name, measure)
{
    var value = 0,
        values = [],
        i = 0,
        last,
        format = d3.time.format.utc("%Y-%m-%d %H:%M:%S");

    return context.metric(function(start, stop, step, callback) {
        start = +start, stop = +stop;
        if (isNaN(last)) last = start;
        url = "restful/nilm.grapher.py?id=" + nameTranlations[name][0] + 
              "&start=" + format(new Date(start)) + 
              "&end=" + format(new Date(stop)) + 
              "&type=" + measure;
        jQuery.ajax({ url: url }).done(function(data) { 
            values = data.split(",");
            callback(null, values);
        });
    }, nameTranlations[name][1]);
}

$(document).ready(function() {
    
    //$.ajax({ url: "restful/nilm.dbsize.py" }).done(function(data) { 
    //    $("#db-size").empty().append(data);
    //});


    d3.select("#realpower").call(function(div) {
        div.append("div")
            .attr("class", "axis")
            .call(context.axis().orient("top"));

        div.selectAll(".horizon")
            .data([eAll, eHVAC, eKitchen, eClothes, eComputer, eMediaTV, eOther, eUnmetered])
            .enter().append("div")
            .attr("class", "horizon")
            .attr("measure", "W")
            .call(context.horizon().extent([-9000, 9000]));//120

         div.append("div")
            .attr("class", "rule")
            .call(context.rule());
    });

    context.on("focus", function(i) {
        d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

});

