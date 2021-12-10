var _tableSelectedCell;

function updateTip() {
    var tipPercentage = document.getElementById('tip-percentage').value;
    var percentageSlider = document.getElementById('percentage-slider').value = tipPercentage;
    var amount = document.getElementById('price').value;

    if (tipPercentage === '' || amount === '') {
        document.getElementById('tip-amount').innerHTML = '0.00';
        return ;
    }

    var tipAmount = amount * tipPercentage / 100;
    document.getElementById('tip-amount').innerHTML = tipAmount.toFixed(2);
}

function addListing() {
    var tipPercentage = document.getElementById('tip-percentage').value;
    var amount = parseFloat(document.getElementById('price').value, 10).toFixed(2).toString();
    var name = document.getElementById('name').value;
    var tipAmount = document.getElementById('tip-amount').innerHTML;

    if (name === '' || tipPercentage === '' || amount === '') {
        alert('Please fill out empty field(s)!');
        return ;
    }

    var data = {
        name: name,
        amount: amount,
        tipPercentage: tipPercentage
    };

    if (!localStorage.getItem('listings')) localStorage.setItem('listings', JSON.stringify([]));
    var listings = JSON.parse(localStorage.getItem('listings'));
    listings.push(data);

    localStorage.setItem('listings', JSON.stringify(listings));

    updateTable();
}

function updateTable() {
    var table = document.getElementById('listings-table');
    var headerRow = table.rows[0];
    table.innerHTML = '';
    table.appendChild(headerRow);

    var data = JSON.parse(localStorage.getItem('listings'));
    if (!data) return ;

    data.forEach((row, i) => {
        var rowElement = table.insertRow();
        rowElement.addEventListener('mouseenter', function() {
            var rect = this.getBoundingClientRect();
            var x = rect.right + 5;
            var y = (rect.top + rect.bottom) / 2 - 13 + window.scrollY - 155;

            var el = document.getElementById('delete-button');
            el.className = 'visible';
            el.style.left = x + 'px';
            el.style.top = y + 'px';

            el.currentlySelectedRow = i;
        });

        for (var property in row) {
            var value = row[property];
            if (property != 'name') value = parseFloat(value, 10).toString();
            if (value === 'NaN') value = '0';

            newCell(rowElement, value);
        }

        var amount = parseFloat(row.amount, 10);
        var tipPercentage = parseFloat(row.tipPercentage, 10);
        var tipAmount = (amount * tipPercentage / 100);
        var totalAmount = (amount + tipAmount).toFixed(2);
        tipAmount = tipAmount.toFixed(2);

        if (tipAmount === 'NaN') {
            tipAmount = '0.00';
            totalAmount = '0.00';
        }

        newCell(rowElement, tipAmount, true);
        newCell(rowElement, totalAmount, true);
    });
}

function newCell(rowElement, text, removeEditable = false) {
    cellElement = rowElement.insertCell();
    if (removeEditable) cellElement.contentEditable = false;
    cellElement.innerHTML = '<p>' + text + '</p>';

    function setAsSelected() {
        if (_tableSelectedCell != undefined) _tableSelectedCell.className = '';
        _tableSelectedCell = this;
        this.className = 'selected';
    }

    cellElement.addEventListener('click', setAsSelected);
}

function getTableData() {
    var data = [];

    var table = document.getElementById('listings-table');
    for (var i in table.rows) {
        var row = table.rows[i];
        if (!parseFloat(i, 10)) continue ;

        var rowData = {
            name: row.children[0].firstChild.innerHTML,
            amount: row.children[1].firstChild.innerHTML,
            tipPercentage: row.children[2].firstChild.innerHTML
        }

        data.push(rowData);
    }

    return data;
}

function updateTipAmounts () {
    var table = document.getElementById('listings-table');
    
    for (var i in table.rows) {
        var row = table.rows[i];
        if (!parseFloat(i, 10)) continue ;

        var amount = parseFloat(row.children[1].firstChild.innerHTML, 10);
        var tipPercentage = parseFloat(row.children[2].firstChild.innerHTML, 10);

        var tipAmount = (amount * tipPercentage / 100);
        var totalAmount = (amount + tipAmount).toFixed(2);
        tipAmount = tipAmount.toFixed(2);

        if (!parseFloat(tipAmount, 10)) {
            tipAmount = '0.00';
            totalAmount = '0.00';
        }

        row.cells[3].innerHTML = '<p>' + tipAmount + '</p>';
        row.cells[4].innerHTML = '<p>' + totalAmount + '</p>';
    }
}

function updateLocalStorageFromTable() {
    var data = JSON.stringify(getTableData());
    localStorage.setItem('listings', data);
}

function deleteRow() {
    if (!confirm('Are you sure you want to delete this row?')) return ;

    var el = document.getElementById('delete-button');

    var data = JSON.parse(localStorage.getItem('listings'));
    data.splice(el.currentlySelectedRow, 1);

    var str = JSON.stringify(data);
    localStorage.setItem('listings', str);

    updateTable();
}

function checkForBlanks(input) {
    var table = document.getElementById('listings-table');
    var rows = table.rows;
    for (var i in rows) { 
        if (!parseFloat(i, 10)) continue ;
        var row = rows[i];
        for (var j in row.cells) {
            if (j != 0 && !parseFloat(j, 10)) continue ;
            var cell = row.cells[j];
            if (cell.children[0].tagName !== 'P' || !cell.children[0].childNodes.length) {
                cell.innerHTML = '';
                var pElement = document.createElement('p');
                cell.appendChild(pElement);
                
                if (input.inputType == 'insertText') pElement.innerHTML = input.data;
                
                var range = document.createRange();
                var sel = window.getSelection();

                if (pElement.childNodes.length) {
                    range.setStart(pElement.childNodes[0], 1);
                    range.collapse(true);

                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        };
    };
}

function updatePercentageField() {
    var value = document.getElementById('percentage-slider').value;
    document.getElementById('tip-percentage').value = value;

    updateTip();
}

window.addEventListener('load', () => {
    document.getElementById('main').className = 'visible';
    updateTable();

    var table = document.getElementById('listings-table');
    table.addEventListener('input', input => {
        updateLocalStorageFromTable();
        updateTipAmounts();
        checkForBlanks(input);
    });

    var containerElement = document.getElementById('listings-container');
    containerElement.addEventListener('mouseleave', function() {
        var el = document.getElementById('delete-button');
        el.className = '';
    });
}, false);