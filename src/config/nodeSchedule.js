const schedule = require("node-schedule");
const Voucher = require("../models/Voucher");
const DiscountProgram = require("../models/DiscountProgram");
const dayjs = require("dayjs");

const currentDate = dayjs(new Date()).format("YYYY-MM-DD");

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;

const nodeSchedule = schedule.scheduleJob(rule, async () => {
  try {
    await Voucher.updateMany(
      {
        dateEnd: { $lt: currentDate },
        status: "active",
      },
      {
        $set: { status: "disable" },
      }
    );

    await Voucher.updateMany(
      {
        dateEnd: { $gte: currentDate },
        status: "incoming",
      },
      {
        $set: { status: "active" },
      }
    );

    await DiscountProgram.updateMany(
      {
        dateEnd: { $lt: currentDate },
        status: "active",
      },
      {
        $set: { status: "disable" },
      }
    );

    await DiscountProgram.updateMany(
      {
        dateStart: { $gte: currentDate },
        status: "incoming",
      },
      {
        $set: { status: "active" },
      }
    );
  } catch (error) {
    console.error("Error updating data:", error);
  }
});

module.exports = nodeSchedule;
