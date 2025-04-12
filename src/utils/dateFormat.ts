import { format as datefnsFormat, isAfter, isBefore, isMatch, isToday, parse } from 'date-fns'

type FormatTypes =
  | 'dd/MM/yyyy'
  | 'dd/MM/yy'
  | 'dd/MM/yyyy HH:mm'
  | 'yyyy-MM-dd'
  | 'yyyy-MM-dd HH:mm'
  | 'dd/MM/yyyy HH:mm:ss'

export class DateFormatEnum {
  static readonly FullDate = new DateFormatEnum('FullDate', 'dd/MM/yyyy')
  static readonly FullDateShort = new DateFormatEnum('FullDateShort', 'dd/MM/yy')
  static readonly FullDateAmerican = new DateFormatEnum('FullDateAmerican', 'yyyy-MM-dd')
  static readonly FullDateAmericanAndTime = new DateFormatEnum(
    'FullDateAmerican',
    'yyyy-MM-dd HH:mm'
  )
  static readonly FullDateAndTime = new DateFormatEnum('FullDateAndTime', 'dd/MM/yyyy HH:mm')
  static readonly FullDateAndTimeWithSeconds = new DateFormatEnum(
    'FullDateAndTimeWithSeconds',
    'dd/MM/yyyy HH:mm:ss'
  )

  constructor(private readonly k: string, public readonly v: FormatTypes) {}

  public get key() {
    return this.k
  }

  public get value() {
    return this.v
  }
}

export const dateValidate = (date: string, validateFormat: FormatTypes) => {
  if (!date) return ''

  return date.length === validateFormat.length && isMatch(date, validateFormat)
}

export const isDateBefore = (date1: string, date2: string) => {
  return isBefore(date1, date2)
}

export const isDateAfter = (date1: string, date2: string) => {
  return isAfter(date1, date2)
}

export const isDateToday = (date1: string) => {
  return isToday(date1)
}

export const dateFormat = (
  date: string | Date | undefined | null,
  dateFormat: FormatTypes,
  fromFormat?: FormatTypes
) => {
  if (!date) return ''

  if (dateFormat === DateFormatEnum.FullDate.value && date && typeof date === 'string') {
    date = date.substr(0, 10)
  }

  let dateToFormat: string | Date = date
  if (fromFormat && typeof date === 'string') {
    dateToFormat = parse(date, fromFormat, new Date())
  }

  return datefnsFormat(dateToFormat, dateFormat)
}
