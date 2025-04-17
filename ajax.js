const API_URL = "http://gamf.nhely.hu/ajax2/";
const code = "O4NEQBEA1HYA"; // Neptun + egyedi azonosító

// ✅ Validáció: mezők nem lehetnek üresek, és a név max 30 karakter
function validateInputs() {
    const name = document.getElementById("name").value.trim();
    const height = document.getElementById("height").value.trim();
    const weight = document.getElementById("weight").value.trim();

    if (!name || !height || !weight) {
        alert("Minden mezőt ki kell tölteni!");
        return false;
    }

    if (name.length > 30) {
        alert("A név maximum 30 karakter lehet!");
        return false;
    }

    return true;
}

// 🔄 Adatok betöltése és kiírása
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
        let output = "";
        let total = 0;
        let max = 0;

        list.forEach(item => {
            output += `
                <label>
                    <input type="checkbox" name="deleteIds" value="${item.id}">
                    ID: ${item.id} | Név: ${item.name} | Magasság: ${item.height} cm | Súly: ${item.weight} kg
                </label><br>
            `;
            total += parseFloat(item.height);
            if (parseFloat(item.height) > max) max = parseFloat(item.height);
        });

        document.getElementById("dataOutput").innerHTML = output;
        document.getElementById("statsOutput").innerHTML = `
            <strong>Statisztika:</strong><br>
            Összmagasság: ${total} cm<br>
            Átlag: ${(total / list.length).toFixed(2)} cm<br>
            Legnagyobb: ${max} cm
        `;
    });
}

// ➕ Létrehozás (Create)
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
        if (response && response > 0) {
            alert("✅ Sikeresen hozzáadva!");
            readData();
        } else {
            alert("❌ Hiba a hozzáadás során!");
        }
    });
}

// 🔄 Adatok lekérdezése ID alapján (Update előkészítése)
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
        if (!item) return alert("❌ Nincs ilyen ID!");

        document.getElementById("name").value = item.name;
        document.getElementById("height").value = item.height;
        document.getElementById("weight").value = item.weight;
    });
}

// ✏️ Módosítás (Update)
function updateData() {
    if (!validateInputs()) return;

    const id = document.getElementById("id").value;
    if (!id) return alert("Adj meg egy ID-t a módosításhoz!");

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
        if (response && response > 0) {
            alert("✅ Sikeres módosítás!");
            readData();
        } else {
            alert("❌ Nem sikerült módosítani!");
        }
    });
}

// ❌ Törlés több ID alapján (checkbox)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("deleteForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const selected = Array.from(document.querySelectorAll("input[name='deleteIds']:checked"));
        if (selected.length === 0) {
            alert("Jelölj ki legalább egy sort a törléshez!");
            return;
        }

        if (!confirm("Biztosan törölni szeretnéd a kijelölt adatokat?")) return;

        selected.forEach(input => {
            const id = input.value;
            const data = new URLSearchParams();
            data.append("op", "delete");
            data.append("code", code);
            data.append("id", id);

            fetch(API_URL, {
                method: "POST",
                body: data
            })
            .then(res => res.json())
            .then(() => {
                readData();
            });
        });
    });

    // 🔁 Automatikus betöltés oldalinduláskor
    readData();
});
