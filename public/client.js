// URL del servidor Socket.IO
const socket = io("http://10.42.0.1:3000");

// Conexión establecida
socket.on("connect", () => {
    console.log("✅ Conectado al servidor con ID:", socket.id);

});
const ctx = document.getElementById('myChart');
let dht22;

dht22 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["temperatura","humedad"],
        datasets: [{
            label: '# of Votes',
            data: [0, 0],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
socket.on("sensorData", (data) => {
    console.log("📊 Datos recibidos:", data);
    dht22.data.datasets[0].data = [parseFloat(data.temperatura), parseFloat(data.humedad)];
    dht22.update();
});