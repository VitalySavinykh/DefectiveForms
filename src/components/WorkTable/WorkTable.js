import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import WorkTableItem from './WorkTableItem/WorkTableItem';
import { LINES_COLOR } from '../../consts';
import TypeContext from '../../context';

function WorkTable({
  works, namePrefix, disabled, removeHandler,
}) {
  const type = useContext(TypeContext);
  const isDisplay = type === 'disp';

  const workList = works.map((work, idx) => (
    <WorkTableItem
      workData={work}
      disabled={disabled}
      namePrefix={`${namePrefix}-work-${work.id}`}
      number={idx + 1}
      key={work.id}
      removeHandler={removeHandler}
    />
  ));

  return (
    <>
      <style type="text/css">
        {`
          .table-bordered, .table-bordered td, .table-bordered th{
            border: 1px solid ${LINES_COLOR}
          }
          .table-striped tbody tr:nth-of-type(2n+1) {
            background-color: rgba(214, 203, 199, 0.1);
          }
          .table-bordered thead td, .table-bordered thead th{
            vertical-align: top;
          }
        `}
      </style>
      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование выполняемой работы</th>
            <th>Ед. изм.</th>
            <th>Кол-во </th>
            <th>МТР</th>
            <th>Примечание</th>
            {!isDisplay && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>{workList}</tbody>
      </Table>
    </>
  );
}

export default WorkTable;
