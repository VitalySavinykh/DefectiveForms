import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import TypeContext from '../../context';
import { saveItem } from '../../helpers/helpers';

/**
 * TODO: Переписать DefectiveForm на классовый компонент, Divisions и Header,
 * чтобы все данные получалисьв в одном месте(DefectiveForm) и прокидывались компонентам вниз.
 *
*/

function DefectiveForm() {
  const type = useContext(TypeContext);
  const isEditForm = type === 'edit';
  const renderISOTime = (new Date()).toISOString();
  const [saving, changeSaving] = useState(false);


  /**
   * @description получаем значение элемента.
   * Если element - HTML коллекция, то возвращаем массив значений.
   * @param {HTMLElement|HTMLCollection} element
   * @return {String|String[]} - значение элемента или массив значений HTML коллекции.
   */
  const getElementValue = (element) => {
    let value;
    if (element instanceof HTMLCollection) {
      value = [...element].map((e) => e.value);
    } else {
      value = element.value;
    }
    return value;
  };

  /**
   * @description Формирование JSON`а на основе элементов формы для тела запроса
   * @param {HTMLCollection} formElements - Все элементы формы, элементы формы.
   * @return {Object} - объект для отправки данных формы в теле запроса.
   */
  const formToJSON = (formElements) => {
    const notForJSONFieldNames = ['copy'];
    const jsonFormValues = Object.create(null);
    jsonFormValues.orgunit = null;
    jsonFormValues.title = null;
    jsonFormValues.ListDataJSON = { divisions: [] };

    // Имена элементов формы с фильтром НЕ ПУСТО и не copy, так как его значение сохранять не надо.
    const formElementsName = [...formElements]
      .map((element) => element.name)
      .filter((name) => !notForJSONFieldNames.includes(name) && name);

    // Уникальный набор имён элементов
    // Перебирая который, определяем как и куда сохранять значение элемента
    new Set(formElementsName)
      .forEach((name) => {
        const element = formElements[name];
        const elementValue = getElementValue(element);

        if (name === 'orgunit') {
          const orgunitTitle = element.options[element.selectedIndex].textContent;

          jsonFormValues[name] = elementValue;
          jsonFormValues.title = `ДФ-${orgunitTitle}-${renderISOTime}`;
        } else if (name === 'condition') {
          jsonFormValues[name] = elementValue;
        } else if (!name.startsWith('divisionTitle')) {
          // Если не предыдущие условия не сработали, то это элемент выбора работы
          const [, divisionId, , workId, field] = name.split('-');
          const divisionIdx = jsonFormValues.ListDataJSON.divisions.findIndex((division) => Number(division.id) === Number(divisionId));
          let division;

          // Если раздел ещё не запомнен, то создаём объект для раздела
          // Сразу добавляем текущую работу
          // И запоминаем в массиве divisions
          if (divisionIdx === -1) {
            division = {
              id: Number(divisionId),
              title: formElements[`divisionTitle-${divisionId}`].value,
              works: [
                {
                  id: workId,
                  [field]: elementValue,
                },
              ],
            };
            jsonFormValues.ListDataJSON.divisions.push(division);
          } else {
            // Иначе такая работа уже есть и нам нужно проделать то же самое с работой раздела
            division = jsonFormValues.ListDataJSON.divisions[divisionIdx];
            const workIdx = division.works.findIndex((work) => work.id === workId);

            if (workIdx === -1) {
              const work = {
                id: workId,
                [field]: elementValue,
              };
              division.works.push(work);
            } else {
              division.works[workIdx][field] = elementValue;
            }
          }
        }
      });
    return jsonFormValues;
  };

  const formSubmitHandler = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const formElements = form.elements;
    const formDataJSON = formToJSON(formElements);
    let saveType = isEditForm;

    if (isEditForm && formElements.copy.checked) {
      saveType = false;
    }

    saveItem(formDataJSON, saveType);
    changeSaving(true);
  };

  return (
    <Form action="?" method="POST" onSubmit={formSubmitHandler}>
      <Header time={renderISOTime}/>
      <Body />
      <Footer saving={saving}/>
    </Form>
  );
}

export default DefectiveForm;
