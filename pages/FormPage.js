import React from 'react';
import Container from 'react-bootstrap/Container';
import DefectiveForm from '../components/DefectiveForm/DefectiveForm';
import TypeContext from '../context';

function FormPage() {
  return (
    <Container>
      {/*
        window.formType служит для определения типа формы: Создание|Просмотр|Редактирование
        и определено непосредственно на странице формы.
      */}
      <TypeContext.Provider value={window.formType}>
        <DefectiveForm />
      </TypeContext.Provider>
    </Container>
  );
}

export default FormPage;
