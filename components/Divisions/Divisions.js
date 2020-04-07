import React, { useState, useEffect, useContext } from 'react';
import StyledReactSelect from '../StyledReactSelect/StyledReactSelect';
// import { CommonLoading } from 'react-loadingg';
import Loader from '../Loader/Loader';
import Section from '../DefectiveForm/Section/Section';
import DivisionSelector from '../DivisionSelector/DivisionSelector';
// import { getData, getItem } from '../../data';
import { getData, getItem } from '../../helpers/helpers';
import TypeContext from '../../context';
// import Export from '../Export/Export';

/**
 * TODO: Убрать дублирование кода при работе с onChange в react select тут и в workSelector.
 * Возможно reducer`ы решат вопрос. Или сделать отдельный компонент (типа Selector).
 */

function Divisions() {
  const type = useContext(TypeContext);
  const isDisplayForm = type === 'disp';
  const isEditForm = type === 'edit';
  const isNewForm = type === 'new';

  const [state, setState] = useState({
    divisions: [],
    selectedDivisions: [],
    itemData: {
      divisions: [],
    },
  });

  // аналог componentDidMount - получаем данные.
  // обновляем стэйт.
  // Зависимость от изменения значения переменной type;
  useEffect(() => {
    if (isNewForm) {
      getData().then((data) => {
        setState((currentState) => ({
          ...currentState,
          divisions: [...data.divisions],
        }));
      });
    } else if (isEditForm || isDisplayForm) {
      Promise.all([getData(), getItem()]).then((data) => {
        const itemDivisions = [...data[1].divisions];
        setState((currentState) => ({
          ...currentState,
          divisions: [...data[0].divisions],
          selectedDivisions: itemDivisions,
          itemData: itemDivisions,
        }));
      });
    }
  }, [isDisplayForm, isEditForm, isNewForm, type]);

  /**
   * @description обработчик удаление раздела из ReactSelect.
   * @param {Number|Null} id - id раздела, который нужно удалить. null - удалить все.
   */
  const removeDivisionHandler = (id) => {
    setState((currentState) => {
      const selectedDivisions = id === null
        ? []
        : currentState.selectedDivisions.filter((division) => division.id !== id);

      return {
        ...currentState,
        selectedDivisions,
      };
    });
  };

  const pickDivisionHandler = (option) => {
    setState((currentState) => ({
      ...currentState,
      selectedDivisions: [...currentState.selectedDivisions, option],
    }));
  };

  const getOptionLabel = (option) => option.title;
  const getOptionValue = (option) => option.id;

  function onChangeReactSelect(selectedValues, evtData) {
    const { action } = evtData;
    let option;
    switch (action) {
      case 'select-option':
        option = evtData.option;
        pickDivisionHandler(option);
        break;
      case 'remove-value':
      case 'pop-value':
        option = evtData.removedValue;
        removeDivisionHandler(option.id);
        break;
      case 'clear':
        removeDivisionHandler(null);
        break;
      default:
        throw new Error('Unhandled react select action type.');
    }
  }

  // Генерация контейнеров с выбором разделов
  const divisionSelectorsConts = state.selectedDivisions.map((selectorDivision) => {
    const division = state.divisions.find((item) => item.id === selectorDivision.id);
    const { id, title } = division;
    let { works } = division;
    const initialValue = isDisplayForm || isEditForm
      ? state.itemData.find((item) => item.id === selectorDivision.id)
      : null;
    const namePrefix = `division-${id}`;
    if (initialValue) {
      // Если есть начальное значение, значит это форма просмотра\редактирования. Значит:
      // мержим работы между уже выбранными в ведомости и оставшимися не выбранными,
      // чтобы предотвратить коллизию айдишников и
      // позволить выбрать(добавить) ранее не выбранные работы.
      const notSelectedWorks = works.filter((work) => {
        const idx = initialValue.works.findIndex((initWork) => Number(initWork.id) === Number(work.id));
        return idx === -1;
      });
      works = [...notSelectedWorks, ...initialValue.works];
    }
    return <DivisionSelector
      removeDivisionHandler={removeDivisionHandler}
      title={title}
      divisionId={id}
      key={id}
      works={works}
      initialValue={initialValue}
      namePrefix={namePrefix}
      disabled={isDisplayForm}
    />;
  });

  // Генерация скрытых инпутов, содержаших значение названий выбранных разделов.
  // Используется при генерации объекта для отправки формы.
  const selectedDivisionsTitles = state.selectedDivisions.map((selectedDiv) => <input type="hidden" name={`divisionTitle-${selectedDiv.id}`} value={selectedDiv.title} key={selectedDiv.id}/>);

  return (
    <>
      {state.divisions.length > 0 ? (
        <>
          <Section title="Выбор разделов">
            <StyledReactSelect
              isMulti
              options={state.divisions}
              value={state.selectedDivisions}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onChange={onChangeReactSelect}
              isDisabled={isDisplayForm}
              placeholder="Начните ввод или выберите мышкой..."
              noOptionsMessage={() => <span>Доступных для выбора разделов нет.</span>}
            />
            {selectedDivisionsTitles}
            {divisionSelectorsConts}
          </Section>
        </>
      ) : (
        <Loader/>
      )}
    </>
  );
}

export default Divisions;
