/**
 * 由这个项目魔改而来：
 * https://github.com/LingyuCoder/react-lunar-calendar
 */

import React from "react"
import './calendar.css'
import getLunarDate from './getLunarDate'

class CalendarHeader extends React.Component {
  onClickLeft = () => {
    var self = this;
    var date = self.props.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
    self.props.onNavChange(new Date(year, month - 1));
  }

  onClickRight = () => {
    var self = this;
    var date = self.props.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month++;
    if (month === 13) {
      month = 1;
      year++;
    }
    self.props.onNavChange(new Date(year, month - 1));
  }

  render() {
    var self = this;
    var date = self.props.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    return (
      <div className="header row s1">
        <div onClick={self.onClickLeft} className="nav-btn s1 center">{'<'}</div>
        <div className="current s5 center">
          <span>{year}年{month}月</span>
        </div>
        <div onClick={self.onClickRight} className="nav-btn s1 center">{'>'}</div>
      </div>
    );
  }
}


class CalendarHead extends React.Component {
  render() {
    var nodes = ['日', '一', '二', '三', '四', '五', '六'].map(function (text, index) {
      var className = "day s1 center" + (index === 0 || index === 6 ? ' weekend' : '');
      return (
        <div className={className} key={text+index}>
          {text}
        </div>
      );
    });
    return (
      <div className="head row s1">
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
      list[0].push('');
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
      lastRow.push('');
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
        var lunarDate;
        var pressCb = isCur ? function () {
        } : function () {
          self.onClickCallback(year, month, day);
        };
        var className = "day s1 center";
        if (isCur) className += ' cur';
        if (isWeekend) className += ' weekend';
        if (day) {
          lunarDate = getLunarDate(new Date(year, month - 1, day));
          lunarDate = (<span className="lunar">
            {lunarDate.month}月{lunarDate.day}
          </span>);
        }
        return (
          <div className={className} onClick={pressCb} key={day+index}>
            {day}
            {lunarDate}
          </div>
        );
      });
      return (
        <div className="row s1" key={rowIndex}>{days}</div>
      );
    });
    return (
      <div className="rows s11 column">
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
        <CalendarHeader date={date} onNavChange={this.onNavChange}></CalendarHeader>
        <div className="calendar column s9">
          <CalendarHead></CalendarHead>
          <CalendarBody current={current} date={date} onSelectedChange={this.onSelectedChange}/>
        </div>
      </div>
    );
  }
}

export default Calendar

