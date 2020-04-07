import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import TypeContext from '../../../context';
import Line from '../../Line/Line';
import { BASE_URL, DEFECTIVE_LISTS_URL } from '../../../consts';
import Loader from '../../Loader/Loader';

function Footer({ saving }) {
  const type = useContext(TypeContext);
  return (
    <>
      <Line/>
      {
        type === 'edit' && <FormGroup controlId="asDublicate"><FormCheck type="checkbox" label="Сохранить как новую" name="copy"/></FormGroup>
        // <Button variant="success" type="submit" data-type="copy">{saving ? <Loader /> : 'Сохранить как новую'}</Button>
      }
      <ButtonToolbar>
        {
          type !== 'disp' && <Button variant="success" type="submit">{saving ? <Loader /> : 'Сохранить'}</Button>
        }
        <Button variant="danger" type="button" className="ml-auto" onClick={() => { window.location = BASE_URL + DEFECTIVE_LISTS_URL; }}>
          Закрыть
        </Button>
      </ButtonToolbar>
    </>
  );
}

export default Footer;
