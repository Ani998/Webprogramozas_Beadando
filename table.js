let tableData = [];

document.getElementById("data-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const email = document.getElementById("email").value.trim();

    if (!name || !email || name.length > 30 || email.length > 30) {
        alert("A mezők nem lehetnek üresek és max. 30 karakter hosszúak lehetnek!");
        return;
    }

    const newData = {
        name,
        age,
        height,
        email
    };

    tableData.push(newData);
    renderTable();
    this.reset();
});

function renderTable() {
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";
    tableData.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.height}</td>
            <td>${item.email}</td>
        `;

        tbody.appendChild(row);
    });
}

function sortTable(columnIndex) {
    tableData.sort((a, b) => {
        const keys = ["name", "age", "height", "email"];
        let valA = a[keys[columnIndex]];
        let valB = b[keys[columnIndex]];

        // Ha szám, akkor úgy hasonlítsunk
        if (!isNaN(valA) && !isNaN(valB)) {
            return valA - valB;
        }

        return valA.localeCompare(valB);
    });

    renderTable();
}

function filterTable() {
    const filter = document.getElementById("search").value.toLowerCase();
    const tbody = document.querySelector("#data-table tbody");

    tbody.innerHTML = "";

    tableData
        .filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(filter)
            )
        )
        .forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.height}</td>
                <td>${item.email}</td>
            `;
            tbody.appendChild(row);
        });
}
