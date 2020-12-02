buttonData = "../../data/samples.json"


function buildPlots() {

    // Fetch the JSON data
    d3.json(buttonData).then(function(data) {

        // Log the data to the console
        console.log(data)

        // Store first item in data array
        var samples = data.samples[0]
            
        // Grab values from the dataset to build the plots
        var sample_values = samples.sample_values;
        var otu_labels = samples.otu_labels;
        var otu_ids = samples.otu_ids;
        var otu_id_strings = otu_ids.map(id => `OTU ${id}`)

        // Grab top 10 OTUs found in individual
        // Note: sample values are sorted in descending order in teh dataset
        // Therefore, can just grab the first 10 items in each array
        var top_sample_values = sample_values.slice(0,10);
        var top_otu_labels = otu_labels.slice(0,10);
        var top_otu_ids = otu_ids.slice(0,10);
        var top_otu_id_strings = otu_id_strings.slice(0,10);
  
        // Log the values to the console
        console.log(`Sample Values: ${top_sample_values}`);
        console.log(`OTU Labels: ${top_otu_labels}`);
        console.log(`OTU IDs: ${top_otu_ids}`);
        console.log(`OTU ID Strings: ${top_otu_id_strings}`);

        // --------------------------- BAR CHART ---------------------------

        // Create trace for horiztonal bar chart with OTU ID strings as labels,
        // sample values as values, and OTU labels as hovertext
        var trace1 = {
            x: top_sample_values,
            y: top_otu_id_strings,
            text: top_otu_labels,
            type: "bar",
            orientation: "h",
        };

        // Plot the data
        var plot_data1 = [trace1];
        var layout = {
            title: "Top 10 OTUs in Individual"
        };
        Plotly.newPlot("bar", plot_data1, layout);

        // --------------------------- BUBBLE CHART ---------------------------

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Plot the data
        var plot_data2 = [trace2];
        var layout = {
            title: "Sample Value by OTU ID",
            xaxis: {
                title: {
                    text: "OTU ID"
                }
            }

        };
        Plotly.newPlot("bubble", plot_data2, layout);
    });
};


buildPlots();

