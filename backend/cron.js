var CronJob = require("cron").CronJob;
var Cron = require("./mongodb_backup.js");

new CronJob(
  "*/5 * * * * *",
  function () {
    Cron.dbAutoBackUp();
  },
  null,
  true,
  "America/New_York"
);
