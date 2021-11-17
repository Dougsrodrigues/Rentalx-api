import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDayJsProvider } from '../IDayJsProvider';

dayjs.extend(utc);

export class DayJsDateProvider implements IDayJsProvider {
  compareDate(start_date: Date, end_date: Date, isBefore: boolean): boolean {
    if (isBefore) {
      return dayjs(start_date).isBefore(end_date);
    }
    return dayjs(start_date).isAfter(end_date);
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }
  addDays(days: number): Date {
    return dayjs().add(days, 'day').toDate();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compare(
    start_date: Date,
    end_date: Date,
    type_time: QUnitType | OpUnitType
  ): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, type_time);
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
}
