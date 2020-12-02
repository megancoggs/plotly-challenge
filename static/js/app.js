// Create reference to belly button dataset
buttonData = "../../data/samples.json"

// Create references to page elements using d3
var dropdown = d3.select("#selDataset");
var metadata_panel = d3.select("#sample-metadata");
var bar_chart = d3.select("#bar");
var bubble_chart = d3.select("#bubble")

// Create function to clear existing data from page elements
function reset() {
    metadata_panel.html("")
    bar_chart.html("")
    bubble_chart.html("")
};

// Create a function to initialize the page

function buildPage() {

    // Clear existing data from page elements
    reset();

    // Fetch data
    d3.json(buttonData).then(function(data) {

        // Populate list of subject IDs for dropdown menu
        data.names.forEach((name) => {
            dropdown.append("option").text(name);
        });

        // Set initial subject ID
        var select_id = dropdown.property("value");

        // Create the plots based on inital or selected subject ID
        buildPlots(select_id);

    });
};

// Create a funtion to build the bar and bubble charts
function buildPlots(select_id) {

    // Fetch the JSON data
    d3.json(buttonData).then(function(data) {
    
        // --------------------------- META DATA TABLE ---------------------------

        var metadata = data.metadata;

        // Filter the data to grab metadata for only the selected subject id
        var subject_metadata = metadata.filter(subject => subject.id == select_id)[0];

        // Get the metadata entries for the selected subject
        Object.entries(subject_metadata).forEach(([key, value]) => {
            // Append the entry to the metadata penel
            metadata_panel.append("h5").text(`${key}: ${value}`);
            });

        // --------------------------- BAR CHART ---------------------------

        // Get sample data for selected subject only
        var subject_sample = data.samples.filter(sample => sample.id == select_id)[0]
        var subj_sample_values = subject_sample.sample_values;
        var subj_otu_labels = subject_sample.otu_labels;
        var subj_otu_ids = subject_sample.otu_ids;
        var subj_otu_id_strings = subj_otu_ids.map(id => `OTU ${id}`)

        // Grab top 10 OTUs found in individual
        // Note: sample values are sorted in descending order in teh dataset
        // Therefore, can just grab the first 10 items in each array
        var top_sample_values = subj_sample_values.slice(0,10);
        var top_otu_labels = subj_otu_labels.slice(0,10);
        var top_otu_ids = subj_otu_ids.slice(0,10);
        var top_otu_id_strings = subj_otu_id_strings.slice(0,10);

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

        var sample_values = data.samples[0].sample_values;
        var otu_labels = data.samples[0].otu_labels;
        var otu_ids = data.samples[0].otu_ids;

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

// Create function to handle changes to selection in dropdown menu
function optionChanged(select_id) {

    // Clear existing data from page elements
    reset();

    // Plot the charts with the new selected ID
    buildPlots(select_id);
}


buildPage();