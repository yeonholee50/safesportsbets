import React from 'react';

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={props['className']}
      id={props['id']}
      style={props['style']}
      value={props['value']}
      data = {props['data']}
      type={props['type']}
      line = {props['line']}
      odds = {props['odds']}
      slipid = {props['slipid']}
      
    >
      {props.children}
    </button>
  );
};

export default Button;
