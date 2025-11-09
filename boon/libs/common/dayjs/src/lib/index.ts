import * as _dayjs from 'dayjs';
import * as itLocale from 'dayjs/locale/it';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as minMax from 'dayjs/plugin/minMax';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

_dayjs.locale(itLocale.name);
_dayjs.extend(utc);
_dayjs.extend(customParseFormat);
_dayjs.extend(timezone);
_dayjs.extend(minMax);
_dayjs.extend(localizedFormat);
export const dayjs = _dayjs;
export const itTz = 'Europe/Rome';
export const utcTz = 'GMT';
export const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
