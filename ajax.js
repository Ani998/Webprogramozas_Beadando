const API_URL = "http://gamf.nhely.hu/ajax2/";
const USER_CODE = "EA1HYA abc123";

function validateInputs(name, height, weight) {
    const maxLength = 30;
    if (!name || !height || !weight) return "A mezők nem lehetnek üresek!";
    if (name.length > maxLength || height.length > maxLength || weight.length > maxLength) {
        return "A mezők max 30 karakter hosszúak lehetnek!";
    }
    return null;
}

function showFeedback(message) {
    document.getElementById("feedback").innerText = message;
}

// Read 
function readData() {
    fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `op=read&code=${encodeURIComponent(USER_CODE)}`
    })
    .then(res => res.json())
    .then(data => {
        const listDiv = document.getElementById("dataList");
        const heightStatsDiv = document.getElementById("heightStats");
        listDiv.innerHTML = "";
        let totalHeight = 0;
        let maxHeight = 0;
        data.list.forEach(item => {
            listDiv.innerHTML += `<p>ID: ${item.id}, Név: ${item.name}, Magasság: ${item.height}, Súly: ${item.weight}</p>`;
            let h = parseFloat(item.height) || 0;
            totalHeight += h;
            if (h > maxHeight) maxHeight = h;
        });
        const avgHeight = data.list.length > 0 ? totalHeight / data.list.length : 0;
        heightStatsDiv.innerHTML = `
            <p>Magasság összesen: ${totalHeight}</p>
            <p>Átlag magasság: ${avgHeight.toFixed(2)}</p>
            <p>Legnagyobb magasság: ${maxHeight}</p>
        `;
    });
}

//Create
function createData() {
    const name = document.getElementById("name").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const validation = validateInputs(name, height, weight);
    if (validation) return showFeedback(validation);

    const body = `op=create&name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&weight=${encodeURIComponent(weight)}&code=${encodeURIComponent(USER_CODE)}`;
    fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(res => res.json())
    .then(res => showFeedback(res === 1 ? "Sikeres hozzáadás!" : "Hiba a hozzáadás során!"));
}

//Update
function updateData() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const validation = validateInputs(name, height, weight);
    if (validation) return showFeedback(validation);

    const body = `op=update&id=${id}&name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&weight=${encodeURIComponent(weight)}&code=${encodeURIComponent(USER_CODE)}`;
    fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(res => res.json())
    .then(res => showFeedback(res === 1 ? "Sikeres módosítás!" : "Hiba a módosítás során!"));
}

//Delete
function deleteData() {
    const id = document.getElementById("deleteId").value;
    const body = `op=delete&id=${id}&code=${encodeURIComponent(USER_CODE)}`;
    fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(res => res.json())
    .then(res => showFeedback(res === 1 ? "Sikeres törlés!" : "Hiba a törlés során!"));
}


function getDataForId() {
    const id = document.getElementById("id").value;
    fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `op=read&code=${encodeURIComponent(USER_CODE)}`
    })
    .then(res => res.json())
    .then(data => {
        const item = data.list.find(entry => entry.id === id);
        if (item) {
            document.getElementById("name").value = item.name;
            document.getElementById("height").value = item.height;
            document.getElementById("weight").value = item.weight;
            showFeedback("Adatok betöltve.");
        } else {
            showFeedback("Nincs ilyen ID.");
        }
    });
}
