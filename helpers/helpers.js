import {
  BASE_URL, DEFECTIVE_LISTS_GUID, WORKS_LIST_GUID, ORGUNITS_LIST_GUID, WORK_CONDITIONS_LIST_GUID,
} from '../consts';

// eslint-disable-next-line
export const getItemID = () => GetUrlKeyValue('ID');
// eslint-disable-next-line
// export const getItemID = () => (window.location.href.indexOf('localhost') !== -1 ? 43 : GetUrlKeyValue('ID'));

function parseItemWork(dataItem) {
  return {
    id: dataItem.Id,
    title: dataItem.Title,
    units: dataItem.fldUnits ? dataItem.fldUnits.Title : '',
    mtp: dataItem.fldMTP,
    note: dataItem.fldNote,
  };
}

function parseGroupItem(dataItem) {
  return {
    id: dataItem.fldDivisionId,
    title: dataItem.fldDivision.Title,
    works: [parseItemWork(dataItem)],
  };
}

/**
 * @description Группирует работы по разделу, так как нельзя сгруппировать их сразу во время запроса
 * @author Vadim Gorbenko <gorbenkovv@nipigas.ru>
 * @param {JSON} data - ответ от шарика с ключём d и массивом results внутри.
 * @returns {Object}
 */
function groupByDivisionId(data) {
  const groupedData = [];
  data.d.results.forEach((dataItem) => {
    const dataItemIdx = groupedData.findIndex((grpItem) => grpItem.id === dataItem.fldDivisionId);
    if (dataItemIdx === -1) {
      const groupItem = parseGroupItem(dataItem);
      groupedData.push(groupItem);
    } else {
      const itemWork = parseItemWork(dataItem);
      groupedData[dataItemIdx].works.push(itemWork);
    }
  });
  return { divisions: groupedData };
}


function createGroupItem(label, value) {
  return {
    label,
    value,
  };
}

function createGroup(groupLabel, optionLabel, optionValue) {
  return {
    label: groupLabel,
    options: [
      createGroupItem(optionLabel, optionValue),
    ],
  };
}


function groupBy(data, groupByField, optionLabelField, optionValueField) {
  const groupedData = [];
  data.d.results.forEach((dataItem) => {
    const groupLabel = dataItem[groupByField];
    const optionLabel = dataItem[optionLabelField];
    const optionValue = dataItem[optionValueField];
    const groupIdx = groupedData.findIndex((grpItem) => grpItem.label === groupLabel);
    if (groupIdx === -1) {
      const group = createGroup(groupLabel, optionLabel, optionValue);
      groupedData.push(group);
    } else {
      const groupItem = createGroupItem(optionLabel, optionValue);
      groupedData[groupIdx].options.push(groupItem);
    }
  });
  return groupedData;
}

/**
 * @description Получение дайджеста для выполнения Post запросов.
 * @author Vadim Gorbenko <gorbenkovv@nipigas.ru>
 * @returns {Promise} - который резолвится в строку дайджест формы.
 */
function getDigest() {
  return fetch(`${BASE_URL}_api/contextInfo`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json;odata=verbose',
      },
    })
    .then((response) => response.json())
    .then((data) => data.d.GetContextWebInformation.FormDigestValue);
}

// получение производств из сответствующего списка
export const getOrgunits = () => fetch(`${BASE_URL}_api/web/lists(guid'${ORGUNITS_LIST_GUID}')/items?$Select=Id,Title,fldApprove/Title,fldConfirm/Title&$expand=fldApprove,fldConfirm`,
  {
    method: 'GET',
    headers: {
      accept: 'application/json;odata=verbose',
    },
  })
  .then((response) => response.json(), console.warn);

// получение условий стеснённости из сответствующего списка
export const getConditions = () => fetch(`${BASE_URL}_api/web/lists(guid'${WORK_CONDITIONS_LIST_GUID}')/items?$Select=Id,fldTitle,fldType`,
  {
    method: 'GET',
    headers: {
      accept: 'application/json;odata=verbose',
    },
  })
  .then((response) => response.json(), console.warn)
  .then((jsonData) => groupBy(jsonData, 'fldType', 'fldTitle', 'Id'), console.warn);

// получение списка работ
export const getData = () => fetch(`${BASE_URL}_api/web/lists(guid'${WORKS_LIST_GUID}')/items?$Select=Id,fldDivisionId,fldDivision/Id,fldDivision/Title,Title,fldUnits/Title,fldMTP,fldNote&$expand=fldDivision,fldUnits`,
  {
    method: 'GET',
    headers: {
      accept: 'application/json;odata=verbose',
    },
  })
  .then((response) => response.json())
  .then(groupByDivisionId, console.warn);

// получение данных элемента
export const getItem = () => {
  const itemID = getItemID();
  const url = `${BASE_URL}_api/web/lists(guid'${DEFECTIVE_LISTS_GUID}')/items(${itemID})?$Select=ListDataJSON`;

  return fetch(url,
    {
      method: 'GET',
      headers: {
        accept: 'application/json;odata=verbose',
      },
    })
    .then((response) => response.json(), console.warn)
    .then((jsonData) => JSON.parse(jsonData.d.ListDataJSON), console.warn);
};

// получение данных для Header компонента
export const getItemHeaderData = () => {
  const itemID = getItemID();
  const url = `${BASE_URL}_api/web/lists(guid'${DEFECTIVE_LISTS_GUID}')/items(${itemID})?$Select=Title,fldOrgunitId,fldWorkConditionId`;

  return fetch(url,
    {
      method: 'GET',
      headers: {
        accept: 'application/json;odata=verbose',
      },
    })
    .then((response) => response.json(), console.warn);
};

// Сохранение элемента при создании\изменении
export const saveItem = (jsonData, isUpdate) => getDigest().then((digest) => {
  const itemID = getItemID();
  // Отключен линтинг т.к. ломается подсветка скобок в vs code при вложенных шаблонных строках;
  // eslint-disable-next-line prefer-template
  const url = `${BASE_URL}_api/web/lists(guid'${DEFECTIVE_LISTS_GUID}')/items${isUpdate ? '(' + itemID + ')' : ''}`;
  const data = JSON.stringify({
    __metadata: { type: 'SP.Data.DefectiveListsListItem' },
    ListDataJSON: JSON.stringify(jsonData.ListDataJSON),
    Title: jsonData.title,
    fldOrgunitId: Number(jsonData.orgunit),
    fldWorkConditionId: Number(jsonData.condition),
  });
  const headers = {
    'Content-Type': 'application/json;odata=verbose',
    accept: 'application/json;odata=verbose',
    'X-RequestDigest': digest,
  };

  if (isUpdate) {
    headers['X-HTTP-Method'] = 'MERGE';
    headers['IF-MATCH'] = '*';
  }

  return fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
    .then(
      () => {
        window.location = `${BASE_URL}Lists/DefectiveLists/AllItems.aspx`;
      },
      () => {
        alert('Во время сохранения произошла ошибка. Попробуйте снова.');
      },
    );
});
