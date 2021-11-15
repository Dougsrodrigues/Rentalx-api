import { OpUnitType, QUnitType } from 'dayjs';

export interface IDayJsProvider {
  compare(
    start_date: Date,
    end_date: Date,
    type_time: QUnitType | OpUnitType
  ): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  addDays(days: number): Date;
}
