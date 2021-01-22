declare module 'react-datetime-picker' {
  import { CalendarProps } from 'react-calendar'
  export default function DateTimePicker(
    props: DateTimePickerProps
  ): JSX.Element

  export interface DateTimePickerProps extends CalendarProps {
    calendarClassName?: string | string[]
    clockClassName?: string | string[]
    calendarIcon?: JSX.Element | null
    className?: string | string[]
    clearIcon?: JSX.Element | null
    dayPlaceholder?: string
    disabled?: boolean
    format?: string
    renderNumbers: boolean
    isOpen?: boolean
    monthPlaceholder?: string
    name?: string
    onCalendarOpen?: () => void
    onCalendarClose?: () => void
    required?: boolean
    showLeadingZeros?: boolean
    yearPlaceholder?: string
  }
}
