import { addMinutes, format, setDefaultOptions } from 'date-fns';
import { ru } from 'date-fns/locale';

setDefaultOptions({ locale: ru });

const getTimeZoneDate = (date, useTimezone) => (
  useTimezone
    ? addMinutes(new Date(date), new Date(date).getTimezoneOffset())
    : new Date(date)
);

export const SERVER_DATE_MASK = 'yyyy-MM-dd HH:mm:ss';

export const formatDate = ({ date, mask = 'dd-MM-yyyy', useTimezone }) => date
  && format(getTimeZoneDate(date, useTimezone), mask);

export const formatToServerDate = (date) => formatDate({ date, mask: SERVER_DATE_MASK });

export const getDayMonthYear = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd.MM.yyyy');

export const getDayMonthName = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM');

export const getHourMinute = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'HH:mm');

export const getDayMonthNameYear = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM yyyy');

export const getDayMonthNameYearTime = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM yyyy, HH:mm');
