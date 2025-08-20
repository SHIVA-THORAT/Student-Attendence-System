const initialStudents = ["Amit Sharma", "Neha Patel", "Rohit Verma", "Sneha Joshi", "Karan Singh"];

// Set today's date by default
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendance-date').value = today;
    initialStudents.forEach(name => addStudent(name));
};

function updateTotals() {
    let presentCount = 0;
    let absentCount = 0;
    const table = document.getElementById('attendance-table');
    for (let i = 1; i < table.rows.length; i++) { // skip header
        if (table.rows[i].cells[2].firstChild.checked) presentCount++;
        if (table.rows[i].cells[3].firstChild.checked) absentCount++;
    }
    document.getElementById('totals').innerText =
        `Date: ${document.getElementById('attendance-date').value} | Present: ${presentCount} | Absent: ${absentCount}`;
}

function addStudent(nameFromData = null) {
    const nameInput = document.getElementById('student-name');
    const name = nameFromData ? nameFromData : nameInput.value.trim();
    if (name === "") {
        alert("Please enter a student name.");
        return;
    }

    const table = document.getElementById('attendance-table');
    const rollNo = table.rows.length; // auto increment roll

    const row = table.insertRow();
    row.innerHTML = `
        <td>${rollNo}</td>
        <td>${name}</td>
        <td><input type="checkbox" id="present${rollNo}" onclick="checkOnly(this, 'absent${rollNo}'); updateTotals();"></td>
        <td><input type="checkbox" id="absent${rollNo}" onclick="checkOnly(this, 'present${rollNo}'); updateTotals();"></td>
        <td><button class="remove-btn" onclick="removeStudent(this)">Remove</button></td>
      `;
    if (!nameFromData) nameInput.value = "";
    updateTotals();
}

function checkOnly(checkbox, otherId) {
    const other = document.getElementById(otherId);
    if (checkbox.checked) {
        other.checked = false;
    }
}

function removeStudent(btn) {
    const row = btn.parentNode.parentNode;
    row.remove();

    const table = document.getElementById('attendance-table');
    // reassign roll numbers
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerText = i;
        table.rows[i].cells[2].firstChild.id = `present${i}`;
        table.rows[i].cells[2].firstChild.setAttribute('onclick', `checkOnly(this, 'absent${i}'); updateTotals();`);
        table.rows[i].cells[3].firstChild.id = `absent${i}`;
        table.rows[i].cells[3].firstChild.setAttribute('onclick', `checkOnly(this, 'present${i}'); updateTotals();`);
    }
    updateTotals();
}

// Submit function
function submitAttendance() {
    const table = document.getElementById('attendance-table');
    const date = document.getElementById('attendance-date').value;
    const list = document.getElementById('attendance-list');
    list.innerHTML = ""; // clear old results

    for (let i = 1; i < table.rows.length; i++) { // skip header
        const name = table.rows[i].cells[1].innerText;
        const isPresent = table.rows[i].cells[2].firstChild.checked;
        const isAbsent = table.rows[i].cells[3].firstChild.checked;
        let status = "Not Marked";
        if (isPresent) status = "Present";
        else if (isAbsent) status = "Absent";

        const li = document.createElement("li");
        li.textContent = `Date: ${date} | ${name} - ${status}`;
        list.appendChild(li);
    }

    document.getElementById('result').style.display = "block";
}