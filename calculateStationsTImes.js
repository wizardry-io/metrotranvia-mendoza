/**
 * Calculate times of stations which are not in the pdf
 */
const times = require("./src/times.json");
const fs = require("fs");

const stationsTimeComparedToMendoza = {
  BELGRANO: 3,
  "25 DE MAYO": 7,
  PELLEGRINI: 10,
  "GODOY CRUZ": 14,
  INDEPENDENCIA: 18,
  "9 DE JULIO": 20,
  "PIEDRA BUENA": 24,
  "ALTA ITALIA": 26,
  MAZA: 28
};

const stationsTimeComparedToGutierrez = {
  BELGRANO: 27,
  "25 DE MAYO": 23,
  PELLEGRINI: 20,
  "GODOY CRUZ": 16,
  INDEPENDENCIA: 12,
  "9 DE JULIO": 10,
  "PIEDRA BUENA": 6,
  "ALTA ITALIA": 4,
  MAZA: 2
};

const addTimes = (time, offset) => {
  const date = new Date();
  date.setHours(
    parseInt(time.split(":")[0], 10),
    parseInt(time.split(":")[1], 10) + offset
  );
  return `${date.getHours()}:${
    date.getMinutes().toString().length === 1
      ? `0${date.getMinutes()}`
      : date.getMinutes()
  }`;
};

const result = {
  weekdays: {},
  saturdays: {},
  sundaysAndHolidays: {}
};

Object.keys(times).map(period => {
  Object.keys(times[period]).map(station => {
    if (!stationsTimeComparedToMendoza[station]) {
      result[period][station] = times[period][station];
      return;
    }
    result[period][station] = {};
    result[period][station].mendozaGutierrezDirection = times[
      period
    ].MENDOZA.mendozaGutierrezDirection.map(time =>
      addTimes(time, stationsTimeComparedToMendoza[station])
    );
    result[period][station].gutierrezMendozaDirection = times[
      period
    ].GUTIERREZ.gutierrezMendozaDirection.map(time =>
      addTimes(time, stationsTimeComparedToGutierrez[station])
    );
  });
});

fs.writeFileSync("times.json", JSON.stringify(result));
