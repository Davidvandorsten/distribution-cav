ui.setTitle("Distribution");

// Create buttons
var dist_hor_button = new ui.Button("Horizontal Distribution");
var dist_ver_button = new ui.Button("Vertical Distribution");
var print_button = new ui.Button("Print Position Info");

// Button onClick callback functions
dist_hor_button.onClick = function () {
    var sel = api.getSelection();

    if (sel.length >= 3) {

        var layers = [];

        for (var layer of sel) {
            layers.push({
                id : layer,
                nname : api.getNiceName(layer),
                position : api.get(layer, "position"),
                bbox : api.getBoundingBox(layer, true),
                pivot: api.get(layer, "pivot")
            })
        }

        layers.sort((a, b) => a.bbox.centre.x - b.bbox.centre.x);

        var total_width = layers[layers.length - 1].bbox.right - layers[0].bbox.left;
        var total_layer_width = layers.reduce((sum, obj) => sum + obj.bbox.width, 0);
        var gap_width = (total_width - total_layer_width) / (layers.length - 1);

        previous_widths = 0;

        for(let i = 1; i < layers.length - 1; i++) {

            previous_widths += layers[i - 1].bbox.width;
            var gaps_width = i * gap_width;
            var new_left_x = layers[0].bbox.left + previous_widths + gaps_width;

            var pivot = layers[i].pivot.x
            // 0,0 is not the centre of a textShape, it's somewhere near the top left corner
            if(api.getLayerType(layers[i].id) == "textShape"){
                pivot = -(layers[i].bbox.left - layers[i].position.x + (layers[i].bbox.width / 2))
            }

            var new_x = new_left_x + (layers[i].bbox.width / 2) + pivot;

            api.set(layers[i].id, {"position.x": new_x});
        }

    } else {
        console.log("At least 3 layers need to be selected");
    }  
}

dist_ver_button.onClick = function () {
    var sel = api.getSelection();

    if (sel.length >= 3) {

        var layers = [];

        for (var layer of sel) {
            layers.push({
                id : layer,
                nname : api.getNiceName(layer),
                position : api.get(layer, "position"),
                bbox : api.getBoundingBox(layer, true),
                pivot: api.get(layer, "pivot")
            })
        }

        layers.sort((a, b) => b.bbox.centre.y - a.bbox.centre.y);

        var total_height = layers[0].bbox.top - layers[layers.length - 1].bbox.bottom;
        var total_layer_height = layers.reduce((sum, obj) => sum + obj.bbox.height, 0);
        var gap_height = (total_height - total_layer_height) / (layers.length - 1);

        previous_heights = 0;

        for(let i = 1; i < layers.length - 1; i++) {
            previous_heights += layers[i - 1].bbox.height;
            var gaps_heights = i * gap_height;
            var new_top_y = layers[0].bbox.top - previous_heights - gaps_heights;

            var pivot = layers[i].pivot.y
            // 0,0 is not the centre of a textShape, it's somewhere near the top left corner
            if(api.getLayerType(layers[i].id) == "textShape"){
                pivot = -(layers[i].bbox.top - layers[i].position.y - (layers[i].bbox.height / 2))
            }

            var new_y = new_top_y - (layers[i].bbox.height / 2) + pivot;

            api.set(layers[i].id, {"position.y": new_y});
        }

    } else {
        console.log("At least 3 layers need to be selected");
    }  
}

print_button.onClick = function () {
    var sel = api.getSelection();
    console.log("api.getBoundingBox: " + JSON.stringify(api.getBoundingBox(sel[0], true)))
    console.log("api.get(sel[0], 'pivot'): " + JSON.stringify(api.get(sel[0], "pivot")))
    console.log("api.get(sel[0], 'position'): " + JSON.stringify(api.get(sel[0], "position")))
}

// Create layout and show window
ui.addStretch();
ui.add(dist_hor_button);
ui.add(dist_ver_button);
//Debugging
// ui.add(print_button);
ui.addStretch();
ui.show();