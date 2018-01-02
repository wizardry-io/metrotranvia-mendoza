/**
 * Calculates times with pdf copy paste format like the one on Summer 2018 pdf
 * - Copy times on pdf. All stations times will be copied.
 * - Paste results in editor and format like a js array
 * - Copy array to times variable
 * - Run `node horas.js`
 * - Paste each station result in times.json
 */
const times = [
  ["8:00", "8:08", "8:14", "8:18", "8:25", "8:30"],
  ["8:42", "8:50", "8:56", "9:00", "9:07", "9:12"],
  ["9:25", "9:33", "9:39", "9:43", "9:50", "9:55"],
  ["10:07", "10:15", "10:21", "10:25", "10:32", "10:37"],
  ["10:50", "10:58", "11:04", "11:08", "11:15", "11:20"],
  ["11:32", "11:40", "11:46", "11:50", "11:57", "12:02"],
  ["12:15", "12:23", "12:29", "12:33", "12:40", "12:45"],
  ["12:57", "13:05", "13:11", "13:15", "13:22", "13:27"],
  ["14:30", "14:38", "14:44", "14:48", "14:55", "15:00"],
  ["15:13", "15:21", "15:27", "15:31", "15:38", "15:43"],
  ["15:55", "16:03", "16:09", "16:13", "16:20", "16:25"],
  ["16:38", "16:46", "16:52", "16:56", "17:03", "17:08"],
  ["17:20", "17:28", "17:34", "17:38", "17:45", "17:50"],
  ["18:03", "18:11", "18:17", "18:21", "18:28", "18:33"],
  ["18:45", "18:53", "18:59", "19:03", "19:10", "19:15"],
  ["19:28", "19:36", "19:42", "19:46", "19:53", "19:58"]
];

const stations = [
  "GUTIERREZ",
  "LUZURIAGA",
  "PROGRESO",
  "SAN MARTIN",
  "PEDRO MOLINA",
  "MENDOZA"
];

const result = times.reduce(
  (total, row) => {
    row.forEach((stationTime, index) => {
      total[stations[index]].push(stationTime);
    });
    return total;
  },
  {
    MENDOZA: [],
    "PEDRO MOLINA": [],
    "SAN MARTIN": [],
    PROGRESO: [],
    LUZURIAGA: [],
    GUTIERREZ: []
  }
);

console.log(JSON.stringify(result));
