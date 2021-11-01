async function getCountries() {
  try {
    const data = await axios.get(`https://api.covid19api.com/countries`);
    return data;
  } catch (err) {
    console.log(err);
  }
}
function getCountryAllStatus(country, from, to) {
  try {
    const fromDate = from;
    const toDate = to;

    let url = `https://api.covid19api.com/country/${country}`;

    if (from || to) {
      url += "?";
      if (from) url += `from=${fromDate}T00:00:00Z`;
      if (from && to) url += `&`;
      if (to) url += `to=${toDate}T00:00:00Z`;
    }

    const data = axios.get(url);

    return data;
  } catch (err) {
    console.log(err);
  }
}

document
  .getElementById("cmbCountry")
  .addEventListener("DOMContentLoaded", SetCountries());

document.getElementById("filtro").addEventListener("click", SetCountryData);

async function SetCountries() {
  const select = document.getElementById("cmbCountry");
  let countries = await getCountries();

  _.forEach(_.orderBy(countries.data, "Country"), (d) => {
    const option = document.createElement("option");
    option.value = d.Slug;
    option.innerText = d.Country;
    select.appendChild(option);
  });
}

async function SetCountryData() {
  const dateStart = document.getElementById("date_start");
  const dateEnd = document.getElementById("date_end");
  const country = document.getElementById("cmbCountry");
  const dataType = document.getElementById("cmbData");
  getCountryAllStatus(
    country.value,
    dateStart.value,
    dateEnd.value,
    dataType.value
  ).then((d) => SetData(d.data, dataType));
}

function SetTotals(totalConfirmed, totalDeaths, totalRecovered) {
  const confirmed = document.getElementById(`kpiconfirmed`);
  confirmed.innerText = totalConfirmed;

  const death = document.getElementById(`kpideaths`);
  death.innerText = totalDeaths;

  const recovered = document.getElementById(`kpirecovered`);
  recovered.innerText = totalRecovered;
}

function SetData(data, type) {
  const totalConfirmed = _.sumBy(data, "Confirmed");
  const totalDeaths = _.sumBy(data, "Deaths");
  const totalRecovered = _.sumBy(data, "Recovered");

  SetTotals(totalConfirmed, totalDeaths, totalRecovered);

  SetTimelineByStatus(data, type);
}

function SetTimelineByStatus(data, type) {
  console.log(data);

  const ctx = document.getElementById(`linhas`).getContext(`2d`);

  const config = {
    type: "line",
    data: {
      labels: _.map(data, "Date"),
      datasets: [
        {
          label: "Total de Mortes por país",
          data: _.map(data, type),
          backgroundColor: "red",
          borderWidth: 1,
        },
      ],
    },
  };

  const myChart = new Chart(ctx, config);
}
