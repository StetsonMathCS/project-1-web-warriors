function processData(data) {
    console.log(data);
}

function extractAndProcessData(csvFileName) {
    var dataSelected = csvFileName;

    fetch(dataSelected)
        .then(response => response.text())
        .then(csvText => {
            var data = parseCSV(csvText);
            //Processes all data for the file selected currently
            processData(data);
            
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

function parseCSV(csvText) {
    var rows = csvText.split('\n');
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i].split(',');
        data.push(row)
    }

    return data;
}



