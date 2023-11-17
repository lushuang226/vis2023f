// Your JavaScript code goes here

// Function to create a two-dimensional array
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create a two-dimensional array
a3 = createArray(121, 15);
a3[0] = ['序號', '班級', '學號', '姓名', 'GitHub', '作業一', '作業二', '作業三', '作業四', '作業五', '作業六', '作業七', '作業八', '作業九', '作業十'];

// Populate the array with random data
for (var i = 1; i < a3.length; i++) {
    a3[i][0] = i;
    var departments = ['資工系', '資工所', '電資AI', '電資資安', '創新AI'];
    departments = shuffleArray(departments);
    if (i < departments.length) {
        a3[i][1] = departments[i];
    } else {
        a3[i][1] = departments[i % departments.length];
    }
    a3[i][2] = 112598000 + Math.floor(Math.random() * 999);
    a3[i][3] = String.fromCharCode(Math.floor(Math.random() * 0x51ff + 0x4e00)) +
               String.fromCharCode(Math.floor(Math.random() * 0x51ff + 0x4e00)) +
               String.fromCharCode(Math.floor(Math.random() * 0x51ff + 0x4e00));
    
    a3[i][4] = (Math.random() + 1).toString(36).substring(2);

    for (var j = 5; j < a3[0].length; j++) {
        a3[i][j] = Math.floor(Math.random() * 10);
    }
}

// Create a table and append it to the DOM
let table = document.createElement('table');
for (let row of a3) {
    table.insertRow();
    for (let cell of row) {
        let newCell = table.rows[table.rows.length - 1].insertCell();
        newCell.textContent = cell;
    }
}
document.body.appendChild(table);

// Function to convert table data to CSV format
function tableToCSV() {
    var csv_data = [];

    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td,th');
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerHTML);
        }
        csv_data.push(csvrow.join(","));
    }

    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data);
}

// Function to download the CSV file
function downloadCSVFile(csv_data) {
    CSVFile = new Blob([csv_data], { type: "text/csv" });
    var temp_link = document.createElement('a');
    temp_link.download = "data.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
}
