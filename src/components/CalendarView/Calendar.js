import React, {memo, useMemo, useState} from 'react'
import './Calendar.css'
import clsx from "clsx"
import PropTypes from 'prop-types'
import solarLunar from "solarlunar"
import EntryIcon from '../EntryIcon'

/**
 * 获取一天的【0时0分0秒0毫秒】时间戳
 * @param timestamp
 * @returns {number}
 */
export function h0(timestamp = Date.now()) {
  const target = new Date(timestamp)

  target.setHours(0)
  target.setMinutes(0)
  target.setSeconds(0)
  target.setMilliseconds(0)

  return target.getTime()
}

/**
 * 日历头
 */
function CalendarHeader(props) {
  const {
    date,
    onNavChange,
    onSelect,
  } = props

  const goNextMonth = (next = true) => {
    const newDate = new Date(date.getTime())

    if (next) {
      newDate.setMonth(date.getMonth() + 1)
    } else {
      newDate.setMonth(date.getMonth() - 1)
    }
    onNavChange(newDate)
  }

  const goToday = () => {
    onNavChange(new Date())
    onSelect(new Date())
  }

  return (
    <div className="calendar-header">
      <div
        onClick={() => goNextMonth(false)}
        className="calendar-header-nav __go"
      >◀
      </div>
      <div
        className="calendar-header-nav"
        onClick={goToday}
      >
        <span>{date.getFullYear()} 年 {date.getMonth() + 1} 月</span>
      </div>
      <div
        onClick={() => goNextMonth()}
        className="calendar-header-nav __go"
      >▶
      </div>
    </div>
  )
}

CalendarHeader.propTypes = {
  date: PropTypes.object.isRequired,
  onNavChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

/**
 * 星期
 */
const CalendarWeeks = memo(function CalendarWeeks() {
  return (
    <div className="calendar-body-week">
      {
        ['日', '一', '二', '三', '四', '五', '六'].map((name, index) => {

          return (
            <div
              className={clsx('calendar-day center',
                {weekend: index === 0 || index === 6})
              }
              key={name + index}
            >{name}</div>
          )
        })
      }
    </div>
  )
})


// 获取某个月有多少天
const getMonthLength = (date) => {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  nextMonth.setHours(nextMonth.getHours() - 1);
  return nextMonth.getDate();
}

// 生成日历数组
const generateCalendarTable = (date) => {
  let monthLength = getMonthLength(date);
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() // 这个月的1号是星期几

  let table = [[]];

  // 补齐月份开头空白，星期日为0，星期一到六为 1~6
  table[0] = new Array(firstDay).fill(null)

  let day, row;
  for (let i = 0; i < monthLength; i++) {
    day = i + firstDay;
    row = Math.floor(day / 7);

    table[row] = table[row] || [];
    table[row].push(i + 1);
  }

  const lastIndex = table.length - 1
  // 补齐月末空白
  table[lastIndex] = table[lastIndex].concat(new Array(7 - table[lastIndex].length).fill(null))
  return table;
}

/**
 * Entry 单条条目
 */
const EntryItem = memo(function EntryItem(props) {
  const {
    entry,
    onEntryItemRightClick
  } = props

  return <span
    className="calendar-day-entry-item"
    onClick={(event) => {
      event.stopPropagation()
    }}
    onContextMenu={(event) => {
      onEntryItemRightClick(event, entry)
    }}
  ><EntryIcon entry={entry} title={entry.fields.Title} small={true}/>
  </span>
})
EntryItem.propTypes = {
  entry: PropTypes.object.isRequired,
  onEntryItemRightClick: PropTypes.func.isRequired,
}

/**
 * 当日条目列表
 */
const CalendarEntries = memo(function CalendarEntries(props) {
  const {
    year,
    month,
    day,
    calendarData,
    onEntryItemRightClick
  } = props

  if (calendarData[year] &&
    calendarData[year][month] &&
    calendarData[year][month][day]) {

    return calendarData[year][month][day].map((entry, index) => {
      return <EntryItem
        key={index}
        entry={entry}
        onEntryItemRightClick={onEntryItemRightClick}
      />
    })

  }

  return null
})
CalendarEntries.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number,
  calendarData: PropTypes.object.isRequired,
  onEntryItemRightClick: PropTypes.func.isRequired
}


/**
 * CalendarDay
 */
const CalendarDay = memo(function CalendarDay(props) {

  const {
    year,
    month,
    day,
    calendarData,
    onEntryItemRightClick,
    onSelect,
    isSelected,
    isWeekend,
    isToday,
  } = props

  let lunarData = day ?
    solarLunar.solar2lunar(year, month, day) : null;

  return (
    <div
      className={clsx(
        "calendar-day",
        {'cur': isSelected},
        {'weekend': isWeekend},
        {'today': isToday},
      )}
      onClick={() => {
        day && !isSelected && onSelect(new Date(year, month - 1, day))
      }}
    >
      <div className="calendar-day-item">
        <div className="calendar-day-item-lunar">
          {
            lunarData && (
              lunarData.term || lunarData.dayCn
            )
          }
        </div>
        <div className="calendar-day-item-date">
          {day}
        </div>
      </div>
      <div className="calendar-day-entries">
        <CalendarEntries
          year={year}
          month={month}
          day={day}
          calendarData={calendarData}
          onEntryItemRightClick={onEntryItemRightClick}
        />
      </div>
    </div>
  );

})
CalendarDay.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number,
  calendarData: PropTypes.object.isRequired,
  onEntryItemRightClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isWeekend: PropTypes.bool.isRequired,
  isToday: PropTypes.bool.isRequired,
}

/**
 * 日历本体
 */
function CalendarBody(props) {
  const {
    calendarData, // entries 数据 {2020: {1: {10: [entry1, entry2]}}}
    onEntryItemRightClick,
    selectedDate,
    date,
    onSelect
  } = props

  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  let table = useMemo(() => {
    return generateCalendarTable(date)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  let rows = useMemo(() => {
    return table.map((row, rowIndex) => {
      return (
        <div className="calendar-body-row" key={rowIndex}>
          {
            row.map((day, index) => {
              const dayH0 = h0(new Date(date.getTime()).setDate(day))

              return <CalendarDay
                key={day + index}
                selectedDate={selectedDate}
                date={date}
                year={year}
                month={month}
                day={day}
                calendarData={calendarData}
                onEntryItemRightClick={onEntryItemRightClick}
                onSelect={onSelect}
                isSelected={dayH0 === h0(selectedDate)}
                isWeekend={index === 0 || index === 6}
                isToday={dayH0 === h0()}
              />
            })
          }
        </div>
      );
    });

  }, [
    table,
    calendarData,
    year,
    month,
    date,
    selectedDate,
    onEntryItemRightClick,
    onSelect
  ])

  return (
    <div className="calendar-body-rows-wrap">
      {rows}
    </div>
  )
}

Calendar.propTypes = {
  calendarData: PropTypes.object.isRequired,
  onEntryItemRightClick: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default function Calendar(props) {
  const {
    calendarData,
    onEntryItemRightClick
  } = props

  const now = new Date()
  const [date, setDate] = useState(now)
  const [selectedDate, setSelectedDate] = useState(now)

  return (
    <div className="react-calendar">
      <CalendarHeader
        date={date}
        onNavChange={setDate}
        onSelect={setSelectedDate}
      />
      <div className="calendar-body">
        <CalendarWeeks/>
        <CalendarBody
          calendarData={calendarData}
          onEntryItemRightClick={onEntryItemRightClick}
          selectedDate={selectedDate}
          date={date}
          onSelect={setSelectedDate}/>
      </div>
    </div>
  )
}

Calendar.propTypes = {
  calendarData: PropTypes.object,
  onEntryItemRightClick: PropTypes.func
}
