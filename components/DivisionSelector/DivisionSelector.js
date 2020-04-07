import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Section from '../DefectiveForm/Section/Section';
import WorkSelector from '../WorkSelector/WorkSelector';
import Line from '../Line/Line';

function DivisionSelector({
  divisionId,
  title,
  works,
  initialValue,
  disabled,
  removeDivisionHandler,
  namePrefix,
}) {
  const removeDivisionSelector = () => {
    removeDivisionHandler(divisionId);
  };

  return (
    <>
      <Line />
      {!disabled && (
        <ButtonToolbar>
          <Button
            type="button"
            variant={null}
            onClick={removeDivisionSelector}
            size="sm"
            className="close ml-auto"
            aria-label="Удалить раздел"
            title="Удалить раздел"
          >
            &times;
          </Button>
        </ButtonToolbar>
      )}
      <Section title={`Добавление работ для ${title}`}>
        <WorkSelector
          works={works}
          initialValue={initialValue}
          disabled={disabled}
          namePrefix={namePrefix}
        />
      </Section>
    </>
  );
}

export default DivisionSelector;
