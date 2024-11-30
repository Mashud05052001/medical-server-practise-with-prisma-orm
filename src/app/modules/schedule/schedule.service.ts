import { Schedule } from "@prisma/client";
import {
  addHours,
  addMinutes,
  eachDayOfInterval,
  parse,
  parseISO,
} from "date-fns";
import { toDate, toZonedTime } from "date-fns-tz";
import { prisma } from "../../config";

const createScheduleByAdmin = async (payload: any) => {
  const scheduleDuration = 30;
  // const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zone = "Asia/Dhaka";

  const { startDate, endDate, startTime, endTime } = payload;
  const parsedStartDate = parseISO(startDate);
  const parsedEndDate = parseISO(endDate);
  const intervalDates = eachDayOfInterval({
    start: parsedStartDate,
    end: parsedEndDate,
  });

  const schedules = [];
  for (let date of intervalDates) {
    const parsedStartTime = addHours(parse(startTime, "HH:mm", date), 6);
    const parsedEndTime = addHours(parse(endTime, "HH:mm", date), 6);
    let currentTime = parsedStartTime;
    while (currentTime < parsedEndTime) {
      const upcomingTimeSlot = addMinutes(currentTime, scheduleDuration);
      schedules.push({
        startDate: currentTime,
        endDate: upcomingTimeSlot,
      });
      currentTime = upcomingTimeSlot;
    }
  }

  const result = await prisma.schedule.createMany({ data: schedules });

  return result;
};

export const ScheduleService = {
  createScheduleByAdmin,
};
