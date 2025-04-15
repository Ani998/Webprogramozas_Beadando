const API_URL = "http://gamf.nhely.hu/ajax2/";
const code = "O4NEQBabc123"; // Cseréld le a saját kódodra!

function validateInputs() {
    const name = document.getElementById("name").value.trim();
    const height = document.getElementById("height").value.trim();
    const weight = document.getElementById("weight").value.trim();

    if (!name || !height || !weight || name.length > 30) {
        alert("Minden mezőt ki kell tölteni (max 30 karakter a név)!");
        return false;
    }
    return true;
}

function createData() {
    if (!validateInputs()) return;

    const name = document.getElementById("name").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    const data = new URLSearchParams();
    data.append("op", "create");
    data.append("code", code);
    data.append("name", name);
    data.append("height", height);
    data.append("weight", weight);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(response => {
        alert("Sikeres hozzáadás!");
        readData();
    });
}

function readData() {
    const data = new URLSearchParams();
    data.append("op", "read");
    data.append("code", code);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(response => {
        const list = response.list;
        let html = "";
        let total = 0;
        let max = 0;

        list.forEach(item => {
            html += `<p>${item.id}: ${item.name}, ${item.height} cm, ${item.weight} kg</p>`;
            total += parseFloat(item.height);
            if (parseFloat(item.height) > max) max = parseFloat(item.height);
        });

        document.getElementById("dataOutput").innerHTML = html;
        document.getElementById("statsOutput").innerHTML = `
            Összmagasság: ${total} cm<br>
            Átlagmagasság: ${(total / list.length).toFixed(2)} cm<br>
            Legnagyobb magasság: ${max} cm
        `;
    });
}

function getDataForId() {
    const id = document.getElementById("id").value;
    if (!id) return alert("Adj meg egy ID-t!");

    const data = new URLSearchParams();
    data.append("op", "read");
    data.append("code", code);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(response => {
        const item = response.list.find(i => i.id === id);
        if (!item) return alert("Nincs ilyen ID!");

        document.getElementById("name").value = item.name;
        document.getElementById("height").value = item.height;
        document.getElementById("weight").value = item.weight;
    });
}

function updateData() {
    if (!validateInputs()) return;

    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    const data = new URLSearchParams();
    data.append("op", "update");
    data.append("code", code);
    data.append("id", id);
    data.append("name", name);
    data.append("height", height);
    data.append("weight", weight);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(response => {
        alert("Sikeres módosítás!");
        readData();
    });
}

function deleteData() {
    const id = document.getElementById("id").value;
    if (!id) return alert("Adj meg egy ID-t!");

    const data = new URLSearchParams();
    data.append("op", "delete");
    data.append("code", code);
    data.append("id", id);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(response => {
        alert("Sikeres törlés!");
        readData();
    });
}

// Automatikus betöltés
window.onload = readData;
