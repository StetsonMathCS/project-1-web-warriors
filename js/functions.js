let currentData = [];

function enableDataCheckboxes() {
    document.addEventListener('DOMContentLoaded', function () {
        const checkboxes = document.querySelectorAll('.dataCheckbox');
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.addEventListener('change', updateSelectedData);
        });

        const subheaders = document.querySelectorAll('.card-title');
        subheaders.forEach(subheader => {
            const checkAllCheckbox = subheader.querySelector('.checkAllCheckbox');
            const dataCheckboxes = subheader.nextElementSibling.querySelectorAll('.dataCheckbox');

            checkAllCheckbox.addEventListener('change', () => {
                const isChecked = checkAllCheckbox.checked;
                dataCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
            });

            dataCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    checkAllCheckbox.checked = [...dataCheckboxes].every(checkbox => checkbox.checked);
                });
            });
        });
    });  
}


function exportSelectedData() {
    const selectedData = [];
    const checkboxes = document.querySelectorAll('.dataCheckbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const conditions = checkbox.value.split(',');
            conditions.forEach(condition => {
            const result = processCondition(currentData, condition);
            selectedData.push({ condition, result });
            });
        }
    });
    
    const csvContent = generateCSV(selectedData);
    downloadCSV(csvContent, 'selected_data.csv');
}

function updateSelectedData() {
    exportSelectedData();
}

function processCondition(data, condition) {
    switch (condition) {
        case 'sameValueRepeated':
            return hasSameValueRepeated(data);
        case 'consistentPattern':
            return hasConsistentPattern(data);
        case 'hasZeros':
            return hasZeros(data);
        case 'hasEmptyCells':
            return hasEmptyCells(data);
        default:
            return '';
    }
}

function generateCSV(selectedData) {
    let csvContent = 'Condition,Result\n';
    selectedData.forEach(item => {
        csvContent += `${item.condition},${item.result}\n`;
    });

    return csvContent;
}

function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

function parseCSV(csvText) {
    const rows = csvText.trim().split('\n');
    const data = rows.map(row => row.split(','));
    return data;
}

function hasSameValueRepeated(data) {
    if (data.length === 0 || data[0].length === 0) {
        return '';
    }
    const firstValue = data[0][0];
    const sameValueRepeated = data.every(row => row.every(value => value === firstValue));
    return sameValueRepeated ? 'Yes' : 'No';
}

function hasConsistentPattern(data) {
    if (data.length === 0) {
        return '';
    }
    const pattern = data[0].slice(0, 2742);
    const consistentPattern = data.every(row => row.slice(0, 2742).join(',') === pattern.join(','));
    return consistentPattern ? 'Yes' : 'No';
}

function hasZeros(data) {
    if (data.length === 0) {
        return ''; 
    }
    const flattenedData = data.flat();
    if (flattenedData.length === 0) {
        return '';
    }
    const containsZeros = flattenedData.some(value => value === '0');
    if (!containsZeros) {
        return 'No';
    } else if (flattenedData.includes('0')) {
        return 'Contains true zeros';
    } else {
        return 'Text';
    }
}

function hasEmptyCells(data) {
    if (data.length === 0) {
        return '';
    }
    const containsEmptyCells = data.flat().some(value => value === '');
    return containsEmptyCells ? 'Yes' : 'No';
}