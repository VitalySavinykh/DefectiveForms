import React from 'react';

function Section({ title, children }) {
  return (
    <>
      <fieldset style={{ border: '1px solid #ced4da', padding: '10px' }}>
        <legend>{title}</legend>
        {children}
      </fieldset>
    </>
  );
}

export default Section;
