async function getSummary() {
  try {
    const data = await axios.get(`https://api.covid19api.com/summary`);
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function GetDashboard() {
  const data = await getSummary().then((d) => {
    let data = d.data;
    // totals
    SetTotals(
      data.Global.TotalConfirmed,
      data.Global.TotalDeaths,
      data.Global.TotalRecovered,
      data.Global.Date
    );

    // newCases
    SetNewCases(
      data.Global.NewConfirmed,
      data.Global.NewRecovered,
      data.Global.NewDeaths
    );

    // total per countries
    SetCountriesTotal(data.Countries);
  });
}

function SetTotals(TotalConfirmed, TotalDeaths, TotalRecovered, QueryDate) {
  const confirmed = document.getElementById(`confirmed`);
  confirmed.innerText = TotalConfirmed;

  const death = document.getElementById(`death`);
  death.innerText = TotalDeaths;

  const recovered = document.getElementById(`recovered`);
  recovered.innerText = TotalRecovered;

  const lastUpdate = document.getElementById(`date`);
  lastUpdate.innerText += ` ${QueryDate}`;
}

function SetNewCases(NewConfirmed, NewRecovered, NewDeaths) {
  const ctx = document.getElementById(`pizza`).getContext(`2d`);

  const myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["confirmados", "recuperados", "mortes"],
      datasets: [
        {
          label: "distribuição de novos casos",
          data: [NewConfirmed, NewRecovered, NewDeaths],
          backgroundColor: [`#FF6384`, `#36A2EB`, `#FFCD56`],
          borderWidth: 1,
        },
      ],
    },
  });
}

function SetCountriesTotal(Countries) {
  let TopTen = _.slice(_.orderBy(Countries, ["TotalDeaths"], ["desc"]), 0, 10);
  let TTLabels = _.map(TopTen, "Country");
  let TTData = _.map(TopTen, "TotalDeaths");

  const truncAppend = (n) =>
    `#${_.truncate(n.ID, { length: 6, omission: "" })}`;

  let TTColors = _.map(TopTen, truncAppend);
  console.log(TTColors);

  const ctx = document.getElementById(`barras`).getContext(`2d`);

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: TTLabels,
      datasets: [
        {
          label: "Total de Mortes por país",
          data: TTData,
          backgroundColor: TTColors,
          borderWidth: 1,
        },
      ],
    },
  });
}
