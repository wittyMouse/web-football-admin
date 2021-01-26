import moment from 'moment'

export default {
  data() {
    return {
      showTime: {
        defaultValue: [
          moment('00:00:00', 'HH:mm:ss'),
          moment('23:59:59', 'HH:mm:ss')
        ]
      },
      // 默认日期
      defaultDate: [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ],
      // 默认日期
      defaultDateTime: [
        moment().format('YYYY-MM-DD') + ' 00:00:00',
        moment().format('YYYY-MM-DD') + ' 23:59:59'
      ],
      defaultMoment: [moment(), moment()]
    }
  },
  methods: {
    // 日期范围选择
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },

    // 禁用之后的日期
    disabledAfterDate(current) {
      return current && current > moment().endOf('day')
    },

    // 禁用之前的日期
    disabledBeforeDate(current) {
      return current && current < moment().startOf('day')
    },

    // 获取禁用时间
    disabledDateTime(date) {
      if (date) {
        const current = moment()
        let obj = {}
        if (current.isSame(date, 'day')) {
          const hour = current.get('hour')
          obj['disabledHours'] = () => this.range(0, hour)
        }

        if (current.isSame(date, 'hour')) {
          const minute = current.get('minute')
          obj['disabledMinutes'] = () => this.range(0, minute)
        }

        if (current.isSame(date, 'minute')) {
          const second = current.get('second')
          obj['disabledSeconds'] = () => this.range(0, second)
        }
        return obj
      }
    }

    // 获取禁用时间(范围)
    // disabledRangeTime(dates, type) {
    // }
  }
}
