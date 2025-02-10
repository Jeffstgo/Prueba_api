/* Obtiene las tasas de cambio */
async function getExchangeRates() {
    try {
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) throw new Error('Error al obtener las tasas de cambio');
        return await response.json();
    } catch (error) {
        document.getElementById('resultado').innerText = `Error: ${error.message}`;
    }
}

/* Calcula conversion */
async function convertirMoneda() {
    const cantidad = document.getElementById('cantidad').value;
    const moneda = document.getElementById('moneda').value;
    const data = await getExchangeRates();

    if (!data || !cantidad) return;

    const tasaCambio = moneda === 'dolar' ? data.dolar.valor : data.euro.valor;
    const conversion = (cantidad / tasaCambio).toFixed(2);

    document.getElementById('resultado').innerText = `Resultado: ${cantidad} CLP = ${conversion} ${moneda.toUpperCase()}`;

    renderHistorial(moneda, data[moneda].nombre);
}

/* Renderiza grafico :/ */
let chartInstance = null;

async function renderHistorial(moneda, nombreMoneda) {
  const response = await fetch(`https://mindicador.cl/api/${moneda}`);
  const data = await response.json();

  const labels = data.serie
    .slice(0, 10)
    .map((item) => item.fecha.split("T")[0]);
  const values = data.serie.slice(0, 10).map((item) => item.valor);

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Historial de ${nombreMoneda}`,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          data: values,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  };

  const ctx = document.getElementById("historialChart").getContext("2d");

  /* Elimina grafico anterior si existe */
  if (chartInstance) {
    chartInstance.destroy();
  }

  /* Crea un nuevo grafico */
  chartInstance = new Chart(ctx, config);
}

/* Evento del boton */
document.getElementById('convertir').addEventListener('click', convertirMoneda);
