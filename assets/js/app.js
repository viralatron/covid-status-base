// const axios = require("axios");

async function getSummary() {
  try {
    const data = await getData(`summary`);
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getData(url) {
  try {
    const res = await axios.get(`https://api.covid19api.com/${url}`);
    return res;
  } catch (err) {
    console.log(err);
  }
}

async function GetDashboard() {
  const data = await getSummary().then((d) => {
    const data = d.data;
    // totals
    const confirmed = document.getElementById(`confirmed`);
    confirmed.innerText = data.Global.TotalConfirmed;

    const death = document.getElementById(`death`);
    death.innerText = data.Global.TotalDeaths;

    const recovered = document.getElementById(`recovered`);
    recovered.innerText = data.Global.TotalRecovered;
    // newCases
    // total per countries
  });
}
