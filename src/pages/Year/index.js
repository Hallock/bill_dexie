import { DatePicker, NavBar } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
import './index.scss'

const Year = () => {
  return (
    <div className="billDetail">
      <NavBar className="nav" backArrow={false}>
        <div className="nav-title" >
          {2024}年
          <span className={classNames('arrow', 'expand')}></span>
        </div>
      </NavBar>
      <DatePicker
        className="kaDate"
        title="记账日期"
        precision="year"
        // visible={}
        // onClose={}
        max={new Date()}
        // onConfirm={onDateChange}
      />

      <div className="content">
        <div className='overview'>

        </div>

      </div>
    </div>
  )
};
export default Year;