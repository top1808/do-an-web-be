const schedule = require("node-schedule");
const Voucher = require("../models/Voucher");
const DiscountProgram = require("../models/DiscountProgram");
const { CURRENT_DATE } = require("../utils/constant");

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;

const nodeSchedule = schedule.scheduleJob(rule, async () => {
  try {
    await Voucher.updateMany(
      {
        dateEnd: { $lt: CURRENT_DATE },
        status: "active",
      },
      {
        $set: { status: "disable" },
      }
    );

    await Voucher.updateMany(
      {
        dateEnd: { $gte: CURRENT_DATE },
        status: "incoming",
      },
      {
        $set: { status: "active" },
      }
    );

    await DiscountProgram.updateMany(
      {
        dateEnd: { $lt: CURRENT_DATE },
        status: "active",
      },
      {
        $set: { status: "disable" },
      }
    );

    await DiscountProgram.updateMany(
      {
        dateStart: { $gte: CURRENT_DATE },
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
