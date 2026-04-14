import dayjs from "dayjs";

export const isValidFormatDate = (date: string, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date, format).isValid()
}