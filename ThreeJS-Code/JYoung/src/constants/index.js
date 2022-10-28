export const G = 6.6742e-11;
export const AU = 149597870; // astronomical unit in km
export const CIRCLE = 2 * Math.PI;
export const QUARTER_CIRCLE = Math.PI / 2;
export const KM = 1000;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export const NM_TO_KM = 1.852;
export const LB_TO_KG = 0.453592;
export const LBF_TO_NEWTON = 4.44822162;
export const FT_TO_M= 0.3048;

export const HOUR = 60 * 60;
export const DAY = 24 * HOUR; // duration in seconds
export const YEAR = 365.25; // duration in days
export const CENTURY = 100 * YEAR; // duration in days
export const SIDERAL_DAY = 3600 * 23.9344696;

export const J2000 = new Date('2000-01-01T12:00:00-00:00');

export const DEFAULT_CALC_PER_TICK = 1;

export const REALTIME = 3600 * 10 / 60 / 60; // RealTime
export const HOUR_PER_SECOND = REALTIME * HOUR;
export const DAY_PER_SECOND = HOUR_PER_SECOND * 24;
export const MONTH_PER_SECOND = DAY_PER_SECOND * 30;
export const HALF_YEAR_PER_SECOND = MONTH_PER_SECOND * 6;
export const YEAR_PER_SECOND = HALF_YEAR_PER_SECOND * 2;
