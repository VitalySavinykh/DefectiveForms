import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import TypeContext from '../../../context';

function WorktableItem({
  workData: {
    title, units, id, mtp, comment, count,
  }, disabled, namePrefix, number, removeHandler,
}) {
  const type = useContext(TypeContext);
  const isDisplayForm = type === 'disp';
  return (
    <tr>
      <td>{number}</td>
      <td>
        {isDisplayForm
          ? title
          : <FormControl type="text" disabled={disabled} name={`${namePrefix}-title`} defaultValue={title} />
        }
      </td>
      <td>
        {units}
        <FormControl type="hidden" disabled={disabled} name={`${namePrefix}-units`} value={units} />
      </td>
      <td>
        {
          isDisplayForm
            ? (count || 1)
            : <FormControl type="number" disabled={disabled} name={`${namePrefix}-count`} min="1" defaultValue={count || 1} />
        }
      </td>
      <td>
        {isDisplayForm
          ? mtp
          : <FormControl as="textarea" disabled={disabled} name={`${namePrefix}-mtp`} id="" rows="3" defaultValue={mtp}/>}
      </td>
      <td>
        {
          isDisplayForm
            ? comment
            : <FormControl as="textarea" disabled={disabled} name={`${namePrefix}-comment`} id="" rows="3" defaultValue={comment} />}
      </td>
      {
        !isDisplayForm
        && (
          <td>
            <Button variant="danger" type="button" disabled={disabled} onClick={() => removeHandler(id)}>Удалить</Button>
          </td>
        )
      }
    </tr>
  );
}

export default WorktableItem;
