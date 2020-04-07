import React from 'react';
import ReactSelect from 'react-select';
import {
  ACCENT_COLOR, ACCENT_COLOR_DARK, LINES_COLOR, DISABLE_COLOR,
} from '../../consts';

export default function StyledReactSelect(props) {
  const REACT_SELECT_STYLE = {
    control: (provided, state) => ({
      ...provided,
      borderBottomRightRadius: state.selectProps.asHeader ? '0px' : provided.borderBottomRightRadius,
      borderBottomLeftRadius: state.selectProps.asHeader ? '0px' : provided.borderBottomLeftRadius,
      borderBottomWidth: state.selectProps.asHeader ? '0px' : provided.borderBottomWidth,
      borderColor: LINES_COLOR,
      backgroundColor: state.isDisabled ? DISABLE_COLOR : 'white',
    }),
    singleValue: (provided) => ({
      ...provided,
      backgroundColor: ACCENT_COLOR,
      color: 'white',
      padding: '3px 6px',
      borderRadius: '2px',
      fontSize: '85%',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      backgroundColor: ACCENT_COLOR,
      color: 'white',
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      backgroundColor: ACCENT_COLOR_DARK,
      color: 'white',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    }),
  };

  return <ReactSelect {...props} styles={REACT_SELECT_STYLE}/>;
}
