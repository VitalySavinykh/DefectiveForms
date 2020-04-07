import React, { useState } from 'react';
import StyledReactSelect from '../StyledReactSelect/StyledReactSelect';
import WorkTable from '../WorkTable/WorkTable';

function WorkSelector({
  works, initialValue, disabled, namePrefix,
}) {
  const initialWorks = initialValue && initialValue.works ? initialValue.works : [];
  const [selectedWorks, changeSelectedWorks] = useState(
    initialWorks.length > 0 ? initialWorks : [],
  );

  const pickWorkHandler = (option) => {
    changeSelectedWorks([...selectedWorks, option]);
  };

  const removeWorkHandler = (id) => {
    const newSelectedWorks = id === null
      ? []
      : selectedWorks.filter((work) => Number(work.id) !== Number(id));
    changeSelectedWorks(newSelectedWorks);
  };

  const changeWorks = (selectedValues, evtData) => {
    const { action } = evtData;
    let option;

    switch (action) {
      case 'select-option':
        option = evtData.option;
        pickWorkHandler(option);
        break;
      case 'remove-value':
      case 'pop-value':
        option = evtData.removedValue;
        removeWorkHandler(option.id);
        break;
      case 'clear':
        removeWorkHandler(null);
        break;
      default:
        throw new Error('Unhandled react select action type.');
    }
  };

  const removeWork = (id) => {
    changeSelectedWorks([...selectedWorks.filter((work) => Number(work.id) !== Number(id))]);
  };

  const getOptionLabel = (option) => option.title;
  const getOptionValue = (option) => option.id;

  return (
    <>
      <StyledReactSelect
        asHeader
        options={works}
        value={selectedWorks}
        isMulti
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        onChange={changeWorks}
        isDisabled={disabled}
        placeholder="Начните ввод или выберите мышкой..."
        noOptionsMessage={() => <span>Доступных для выбора работ нет.</span>}
      />
      <WorkTable
        works={selectedWorks}
        disabled={disabled}
        removeHandler={removeWork}
        namePrefix={namePrefix}
      />
    </>
  );
}

export default WorkSelector;
