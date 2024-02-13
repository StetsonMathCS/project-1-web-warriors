function extractAndProcessData() {
        var selectedCsv = document.getElementById("csvSelector").value;
        
        // Fetch the selected CSV file
        fetch(selectedCsv)
            .then(response => response.text())
            .then(csvText => {
                // Parse CSV data
                var data = parseCSV(csvText);
                
                // Process the data based on user selection
                processData(data);
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    }

function parseCSV(csvText) {
        // Split CSV into rows
        var rows = csvText.split('\n');
        
        // Assuming CSV is comma-separated, parse each row
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].split(',');
            data.push(row);
        }
        
        return data;
    }