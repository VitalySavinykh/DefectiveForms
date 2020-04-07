import React from 'react';
import Button from 'react-bootstrap/Button';
import { getItemID } from '../../helpers/helpers';
import { BASE_URL, DEFECTIVE_LISTS_GUID, ORGUNITS_LIST_GUID } from '../../consts';

function Download({ orgunitID }) {
  const itemID = getItemID();
  // УРЛ на специально разработанную для данного проекта службу по генерации Excel файла.
  const href = `${BASE_URL}_layouts/15/Sibur.SharePoint.DefList/services/DocService.svc/GenerateExcelFileGET/${DEFECTIVE_LISTS_GUID}/${itemID}/${ORGUNITS_LIST_GUID}/${orgunitID}`;

  return (
    <>
      {/* Фикс для шарика */}
      <style type="text/css">
        {`
          a.btn-success:visited {
            color: white;
          }
        `}
      </style>
      <Button variant="success" href={href} target="_blank">
        В Excel
      </Button>
    </>
  );
}

export default Download;
