import React from 'react';

const SlipMoney = (props) => {
  return (
    <div className='slip-money'>
      <div className='slip-risk-money'>
        <label>TO RISK</label>
        <br />
        <br />
        <input type='text' className='slip-to-lose' value={props.toLose} placeholder={props.toLose} onChange={(event) => props.onChange(event.target.value, props.slipData)} />
        {}
      </div>
      <div className='slip-win-money'>
        <label>TO WIN</label>
        <br />
        <br />
        {}
        <div className='slip-to-win'>{props.toWin}</div>
      </div>
    </div>
  );
};

export default SlipMoney;
