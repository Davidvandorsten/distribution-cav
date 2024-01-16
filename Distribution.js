ui.setTitle("Distribution");

// Create labels buttons
var spacing_label = new ui.Label("Distribute Spacing");
var dist_hor_button = new ui.Button("Horizontal Distribution");
var dist_ver_button = new ui.Button("Vertical Distribution");
var print_button = new ui.Button("Log Position Info");

var sort_hLayout = new ui.HLayout();
var sort_label = new ui.Label("Sort by other axis");
var sort_checkbox = new ui.Checkbox(true);
sort_hLayout.add(sort_label);
sort_hLayout.addStretch();
sort_hLayout.add(sort_checkbox);

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

        var start_x = layers[0].bbox.left
        var total_width = layers[layers.length - 1].bbox.right - start_x;
        var total_layer_width = layers.reduce((sum, obj) => sum + obj.bbox.width, 0);
        var gap_width = (total_width - total_layer_width) / (layers.length - 1);

        //If the "Sort by other axis" checkbox is checked, the x pos values will be adjusted top to bottom
        //If it is not checked, the x pos values will be adjusted left to right
        if (sort_checkbox.getValue()){
            layers.sort((a, b) => b.bbox.centre.y - a.bbox.centre.y);
        }

        previous_widths = 0;

        for(let i = 1; i < layers.length - 1; i++) {
            previous_widths += layers[i - 1].bbox.width;
            var gaps_width = i * gap_width;
            var new_left_x = start_x + previous_widths + gaps_width;
            
            //The difference between the centre x of the bbox and the x position
            //This incorporates the pivot
            var bboxCentre_xPos_adjustment = layers[i].bbox.centre.x - layers[i].position.x;
            
            //The new x position in world space
            var new_x_centre = new_left_x + (layers[i].bbox.width / 2);

            var new_x_adjusted = new_x_centre - bboxCentre_xPos_adjustment;

            api.set(layers[i].id, {"position.x": new_x_adjusted});
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

        console.log("layers[0].bbox.top: " + layers[0].bbox.top);
        console.log("layers[layers.length - 1].bbox.bottom: " + layers[layers.length - 1].bbox.bottom);

        var start_y = layers[0].bbox.top
        var total_height = start_y - layers[layers.length - 1].bbox.bottom;
        var total_layer_height = layers.reduce((sum, obj) => sum + obj.bbox.height, 0);
        var gap_height = (total_height - total_layer_height) / (layers.length - 1);

        console.log("total_height: " + total_height);
        console.log("total_layer_height: " + total_layer_height);
        console.log("gap_height: " + gap_height);

        // //If the "Sort by other axis" checkbox is checked, the y pos values will be adjusted left to right
        // //If it is not checked, the y pos values will be adjusted top to bottom
        if (sort_checkbox.getValue()){
            layers.sort((a, b) => a.bbox.centre.x - b.bbox.centre.x);
        }

        previous_heights = 0;

        for(let i = 1; i < layers.length - 1; i++) {
            previous_heights += layers[i - 1].bbox.height;
            var gaps_heights = i * gap_height;
            var new_top_y = start_y - previous_heights - gaps_heights;

            //The difference between the centre y of the bbox and the y position
            //This incorporates the pivot
            var bboxCentre_yPos_adjustment = -(layers[i].bbox.centre.y - layers[i].position.y);
            
            //The new y position in world space
            var new_y_centre = new_top_y - (layers[i].bbox.height / 2);

            var new_y_adjusted = new_y_centre + bboxCentre_yPos_adjustment;

            console.log("bboxCentre_yPos_adjustment: " + bboxCentre_yPos_adjustment);
            console.log("new_y_centre: " + new_y_centre);
            console.log("new_y_adjusted: " + new_y_adjusted);

            api.set(layers[i].id, {"position.y": new_y_adjusted});
        }

    } else {
        console.log("At least 3 layers need to be selected");
    }  
}

print_button.onClick = function () {
    var sel = api.getSelection();
    if(sel.length == 1) {
        console.log("api.getBoundingBox: " + JSON.stringify(api.getBoundingBox(sel[0], true)))
        console.log("api.get(sel[0], 'pivot'): " + JSON.stringify(api.get(sel[0], "pivot")))
        console.log("api.get(sel[0], 'position'): " + JSON.stringify(api.get(sel[0], "position")))
    } else {
        console.log("Exactly one layer needs to be selected");
    }
}

// Create layout and show window
ui.addStretch();
ui.add(spacing_label);
ui.add(dist_hor_button);
ui.add(dist_ver_button);
ui.add(print_button);
ui.addStretch();
ui.add(sort_hLayout);
ui.show();