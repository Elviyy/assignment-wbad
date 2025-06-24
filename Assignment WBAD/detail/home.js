const count = document.getElementById("count");
const summary = document.getElementById("summary");
const listCar = document.getElementById("car-choosen");
const saveOrderBtn = document.getElementById("save-order");
const namaPelanggan = document.getElementById("nama-pelanggan");
const daftarPemesanan = document.getElementById("daftar-pemesanan");

const CarPrices = {
    'choose-car-1': 500000,
    'choose-car-2': 700000,
    'choose-car-3': 600000,
    'choose-car-4': 450000
}

const carNames = {
    "choose-car-1": "Toyota Avanza",
    "choose-car-2": "Toyota Kijang Innova",
    "choose-car-3": "Honda HRV",
    "choose-car-4": "Daihatsu Sigra"
}


function getSelectedCars() {
    const selected = [];
    for (let i = 1; i <= 4; i++) {
        const checkbox = document.getElementById(`choose-car-${i}`);
        if (checkbox.checked) {
            const date = document.getElementById(`date-car-${i}`).value;
            const duration = parseInt(document.getElementById(`duration-car-${i}`).value) || 0;
            selected.push({
                id: `choose-car-${i}`,
                name: carNames[`choose-car-${i}`],
                price: CarPrices[`choose-car-${i}`],
                date,
                duration,
                subtotal: CarPrices[`choose-car-${i}`] * duration
            });
        }
    }
    return selected;
}

function updateSummary() {
    const selected = getSelectedCars();
    let listHtml = '<ul>';
    let summaryHtml = '<ul>';
    let total = 0;
    selected.forEach(car => {
        listHtml += `<li>${car.name} (${car.duration} hari, mulai ${car.date})</li>`;
        summaryHtml += `<li>${car.name}: Rp ${car.price.toLocaleString()} x ${car.duration} = <b>Rp ${car.subtotal.toLocaleString()}</b></li>`;
        total += car.subtotal;
    });
    listHtml += '</ul>';
    summaryHtml += '</ul>';
    listCar.innerHTML = 'List Car :' + listHtml;
    summary.innerHTML = 'Summary :' + summaryHtml + `<br><b>Total: Rp ${total.toLocaleString()}</b>`;
    return {selected, total};
}

count.addEventListener('click', function(e) {
    e.preventDefault();
    updateSummary();
});

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    daftarPemesanan.innerHTML = '<h2>Daftar Pemesanan</h2>' + (orders.length === 0 ? '<p>Belum ada pemesanan.</p>' : '');
    orders.forEach((order, idx) => {
        let carsHtml = '<ul>';
        order.cars.forEach(car => {
            carsHtml += `<li>${car.name} (${car.duration} hari, mulai ${car.date}) - Rp ${car.subtotal.toLocaleString()}</li>`;
        });
        carsHtml += '</ul>';
        daftarPemesanan.innerHTML += `
            <div class="order-item" style="border:1px solid #ccc; margin:10px; padding:10px; border-radius:8px;">
                <b>Nama:</b> ${order.nama}<br>
                <b>Mobil:</b> ${carsHtml}
                <b>Total:</b> Rp ${order.total.toLocaleString()}<br>
                <b>Waktu:</b> ${new Date(order.timestamp).toLocaleString()}<br>
                <button onclick="deleteOrder(${idx})">Hapus</button>
            </div>
        `;
    });
}

window.deleteOrder = function(idx) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.splice(idx, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
}

saveOrderBtn.addEventListener('click', function() {
    const {selected, total} = updateSummary();
    const nama = namaPelanggan.value.trim();
    if (!nama) {
        alert('Nama pelanggan wajib diisi!');
        return;
    }
    if (selected.length === 0) {
        alert('Pilih minimal satu mobil!');
        return;
    }
    for (const car of selected) {
        if (!car.date || car.duration <= 0) {
            alert('Tanggal mulai dan durasi sewa wajib diisi dengan benar!');
            return;
        }
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        nama,
        cars: selected,
        total,
        timestamp: Date.now()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    alert('Pemesanan berhasil disimpan!');
});

// Load orders on page load
window.onload = loadOrders;