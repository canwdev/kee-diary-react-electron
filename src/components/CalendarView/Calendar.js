/**
 * 由这个项目魔改而来：
 * https://github.com/LingyuCoder/react-lunar-calendar
 */

import React from "react"
import './calendar.css'
// import getLunarDate from './getLunarDate'
import solarLunar from 'solarlunar';

class CalendarHeader extends React.Component {
  handleChangeMonth = (prev = false) => {
    var date = this.props.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    if (!prev) {
      month++;
      if (month === 13) {
        month = 1;
        year++;
      }
    } else {
      month--;
      if (month === 0) {
        month = 12;
        year--;
      }
    }

    this.props.onNavChange(new Date(year, month - 1));
  }

  handleGoToday = () => {
    this.props.onNavChange(new Date())
    this.props.onSelectedChange(new Date())
  }

  render() {
    var date = this.props.date;
    return (
      <div className="calendar-header">
        <div onClick={() => {
          this.handleChangeMonth(true)
        }} className="calendar-header-nav">←</div>
        <div className="calendar-header-nav" onClick={this.handleGoToday}>
          <span>{date.getFullYear()} 年 {date.getMonth() + 1} 月</span>
        </div>
        <div onClick={() => {
          this.handleChangeMonth()
        }} className="calendar-header-nav">→</div>
      </div>
    );
  }
}


class CalendarHead extends React.Component {
  render() {
    var nodes = ['日', '一', '二', '三', '四', '五', '六'].map(function (text, index) {
      var className = "calendar-day s1 center" + (index === 0 || index === 6 ? ' weekend' : '');
      return (
        <div className={className} key={text + index}>
          {text}
        </div>
      );
    });
    return (
      <div className="row s1">
        {nodes}
      </div>
    );
  }
}

class CalendarBody extends React.Component {
  getFirstDay(year, month) {
    var firstDay = new Date(year, month - 1, 1);
    return firstDay.getDay();
  }

  getMonthLen(year, month) {
    var nextMonth = new Date(year, month, 1);
    nextMonth.setHours(nextMonth.getHours() - 3);
    return nextMonth.getDate();
  }

  getCalendarTable(year, month) {
    var self = this;
    var monthLen = self.getMonthLen(year, month);
    var firstDay = self.getFirstDay(year, month);
    var list = [[]];
    var i, cur, row, col;
    for (i = firstDay; i--;) {
      list[0].push(null);
    }
    for (i = 1; i <= monthLen; i++) {
      cur = i + firstDay - 1;
      row = Math.floor(cur / 7);
      col = cur % 7;
      list[row] = list[row] || [];
      list[row].push(i);
    }
    var lastRow = list[row];
    var remain = 7 - list[row].length;
    for (i = 7 - lastRow.length; i--;) {
      lastRow.push(null);
    }
    return list;
  }

  onClickCallback(year, month, day) {
    this.props.onSelectedChange(new Date(year, month - 1, day));
  }

  render() {
    var self = this;
    var date = self.props.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    var curDate = self.props.current;
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth() + 1;
    var curDay = curDate.getDate();

    var table = self.getCalendarTable(year, month);
    var rows = table.map(function (row, rowIndex) {
      var days = row.map(function (day, index) {
        var isCur = (year === curYear) && (month === curMonth) && (day === curDay);
        var isWeekend = index === 0 || index === 6;

        var now = new Date()
        var isToday = (day === now.getDate()) && (year === now.getFullYear()) && (month === now.getMonth() + 1)

        var lunarData;
        var pressCb = isCur ? function () {
        } : function () {
          self.onClickCallback(year, month, day);
        };
        var className = "calendar-day s1";
        if (isCur) className += ' cur';
        if (isWeekend) className += ' weekend';
        if (isToday) className += ' today';
        if (day) {
          // lunarData = getLunarDate(new Date(year, month - 1, day));
          lunarData = solarLunar.solar2lunar(year, month, day);
        }
        return (
          <div className={className} onClick={pressCb} key={day + index}>
            <div className="calendar-day-item">
              <div className="calendar-day-item-date">
                {day}
              </div>
              <div className="calendar-day-item-lunar">
                {
                  lunarData && (
                    lunarData.term || (lunarData.monthCn + lunarData.dayCn)
                  )
                }

              </div>
            </div>

          </div>
        );
      });
      return (
        <div className="row s1" key={rowIndex}>{days}</div>
      );
    });
    return (
      <div className="s11 column">
        {rows}
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    var cur = new Date();
    this.state = {
      date: cur,
      current: cur
    };
  }

  onNavChange = (date) => {
    this.setState({
      date: date
    });
  }

  onSelectedChange = (date) => {
    this.setState({
      current: date
    });
  }

  render() {
    var date = this.state.date;
    var current = this.state.current;
    return (
      <div className="react-calendar column">
        <CalendarHeader
          date={date}
          onNavChange={this.onNavChange}
          onSelectedChange={this.onSelectedChange}
        />
        <div className="calendar column s9">
          <CalendarHead/>
          <CalendarBody current={current} date={date} onSelectedChange={this.onSelectedChange}/>
        </div>
      </div>
    );
  }
}

export default Calendar

