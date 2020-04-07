import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StyledReactSelect from '../../StyledReactSelect/StyledReactSelect';
import Loader from '../../Loader/Loader';
import TypeContext from '../../../context';
import { getOrgunits, getItemHeaderData, getConditions } from '../../../helpers/helpers';
import Export from '../../Export/Export';
import { ACCENT_COLOR } from '../../../consts';

function Header({ time }) {
  const type = useContext(TypeContext);
  const isDisplayForm = type === 'disp';
  const isNewForm = type === 'new';
  const [state, setState] = useState({
    orgunits: [],
    selectedUnit: 0,
    selectedUnitText: '',
    conditions: [],
    selectedCondition: 0,
  });

  useEffect(() => {
    if (isNewForm) {
      Promise.all([getOrgunits(), getConditions()]).then((data) => {
        setState((currentState) => ({
          ...currentState,
          orgunits: data[0].d.results,
          conditions: data[1],
        }));
      });
    } else {
      Promise.all([getOrgunits(), getItemHeaderData(), getConditions()]).then((data) => {
        const { fldOrgunitId, Title, fldWorkConditionId } = data[1].d;

        setState((currentState) => ({
          ...currentState,
          orgunits: data[0].d.results,
          selectedUnit: fldOrgunitId,
          selectedUnitText: `№ ${Title}`,
          conditions: data[2],
          selectedCondition: fldWorkConditionId,
        }));
      });
    }
  }, [isNewForm]);

  function onChangeSelectedUnit(evt) {
    const select = evt.target;
    const { value } = evt.target;
    const textValue = select.options[select.selectedIndex].textContent;

    setState((currentState) => ({
      ...currentState,
      selectedUnit: value,
      selectedUnitText: `№ ДФ-${textValue}-${time}`,
    }));
  }

  const options = state.orgunits.map((unit) => (
    <option value={unit.ID} key={unit.ID}>
      {unit.Title}
    </option>
  ));

  const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: ACCENT_COLOR,
    fontWeight: 'bold',
  };
  const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  function getInitialOption() {
    for (let i = 0, clength = state.conditions.length; i < clength; i += 1) {
      const condition = state.conditions[i];
      const opts = condition.options;
      for (let j = 0, olength = opts.length; j < olength; j += 1) {
        const opt = opts[j];
        if (opt.value === state.selectedCondition) {
          return opt;
        }
      }
    }
    return undefined;
  }

  let conditionDefaultValue;
  if (state.conditions.length > 0 && state.selectedCondition !== 0) {
    conditionDefaultValue = getInitialOption();
  }

  return (
    <>
      <h2>{state.selectedUnitText || '№'}</h2>
      {state.orgunits.length > 0 ? (
        <FormGroup as={Row} controlId="orgUnitInput">
          <Col sm={12}>
            <FormLabel>Предприятие</FormLabel>
          </Col>
          <Col sm={6}>
            <Form.Control
              as="select"
              name="orgunit"
              value={state.selectedUnit}
              placeholder="Выберите предприятие"
              disabled={isDisplayForm}
              onChange={onChangeSelectedUnit}
            >
              <option value="0" disabled></option>
              {options}
            </Form.Control>
          </Col>
          {isDisplayForm && (
            <Col sm={6}>
              <Export orgunitID={state.selectedUnit} />
            </Col>
          )
          }
        </FormGroup>
      ) : (
        <Loader />
      )}
      {state.conditions.length > 0 ? (
        <Row>
          <Col>
            <label style={{ display: 'block' }}>
              Условия стеснённости
              <StyledReactSelect
                options={state.conditions}
                defaultValue={conditionDefaultValue}
                formatGroupLabel={formatGroupLabel}
                isDisabled={isDisplayForm}
                placeholder="Начните ввод или выберите мышкой..."
                noOptionsMessage={() => <span>Доступных для выбора условий нет.</span>}
                name="condition"
              />
            </label>
          </Col>
        </Row>
      ) : (
        <Loader />
      )}

    </>
  );
}

export default Header;
