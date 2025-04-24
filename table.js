const API_URL = "http://gamf.nhely.hu/ajax2/";
const USER_CODE = "EA1HYA abc123";

// Validáció: HTML + JS oldalon is
function validateInputs(name, height, weight) {
  if (!name || !height || !weight) return "Minden mező kötelező!";
  if (name.length < 2 || name.length > 30) return "A név 2-30 karakter hosszú lehet!";
  if (isNaN(height) || height > 230) return "A magasság legfeljebb 230 lehet!";
  if (isNaN(weight) || weight > 635) return "A súly legfeljebb 635 lehet!";
  return null;
}

function showFeedback(message) {
  document.getElementById("feedback").innerText = message;
}

function loadTableData() {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `op=read&code=${encodeURIComponent(USER_CODE)}`
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";
      data.list.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.height}</td>
          <td>${item.weight}</td>
        `;
        tbody.appendChild(row);
      });
    });
}

function createRecord() {
  const name = document.getElementById("name").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const error = validateInputs(name, height, weight);
  if (error) return showFeedback(error);

  const body = `op=create&name=${name}&height=${height}&weight=${weight}&code=${encodeURIComponent(USER_CODE)}`;
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  })
    .then(res => res.json())
    .then(res => {
      showFeedback(res === 1 ? "Sikeres hozzáadás!" : "Hiba történt!");
      loadTableData();
    });
}

function updateRecord() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const error = validateInputs(name, height, weight);
  if (error) return showFeedback(error);

  const body = `op=update&id=${id}&name=${name}&height=${height}&weight=${weight}&code=${encodeURIComponent(USER_CODE)}`;
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  })
    .then(res => res.json())
    .then(res => {
      showFeedback(res === 1 ? "Sikeres módosítás!" : "Hiba történt!");
      loadTableData();
    });
}

function deleteRecord() {
  const id = document.getElementById("id").value;
  const body = `op=delete&id=${id}&code=${encodeURIComponent(USER_CODE)}`;
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  })
    .then(res => res.json())
    .then(res => {
      showFeedback(res === 1 ? "Sikeres törlés!" : "Hiba történt!");
      loadTableData();
    });
}

function loadDataById() {
  const id = document.getElementById("id").value;
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `op=read&code=${encodeURIComponent(USER_CODE)}`
  })
    .then(res => res.json())
    .then(data => {
      const record = data.list.find(item => item.id === id);
      if (record) {
        document.getElementById("name").value = record.name;
        document.getElementById("height").value = record.height;
        document.getElementById("weight").value = record.weight;
        showFeedback("Adatok betöltve.");
      } else {
        showFeedback("Nincs ilyen ID.");
      }
    });
}

function filterTable() {
  const filter = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    row.style.display = [...cells].some(cell =>
      cell.textContent.toLowerCase().includes(filter)
    ) ? "" : "none";
  });
}

function sortTable(n) {
  const table = document.getElementById("dataTable");
  let rows = Array.from(table.rows).slice(1);
  let asc = table.getAttribute("data-sort") !== "asc";
  table.setAttribute("data-sort", asc ? "asc" : "desc");
  rows.sort((a, b) => {
    const A = a.cells[n].innerText;
    const B = b.cells[n].innerText;
    return asc ? A.localeCompare(B, undefined, { numeric: true }) : B.localeCompare(A, undefined, { numeric: true });
  });
  rows.forEach(row => table.tBodies[0].appendChild(row));
}

document.addEventListener("DOMContentLoaded", loadTableData);
