/**
 * !Чтобы запустить всё успешно на localhost нужно:
 *  1. раскоментировать полифил starts-with
 *  2. в public/index.html раскоментировать строку с window.formType, которая определяет тип формы
 *  3. в helpers.js переключить функцию getItemID.
 *     В закоментированной можно выбирать какой айдишник будем грузить.
*/

// You need starts-with for localhost on IE,
// but you dont need it in sharepoint.

// import 'core-js/features/string/starts-with';
import 'core-js/features/object';
import 'core-js/features/array';
import 'core-js/features/map';
import 'core-js/features/set';
import 'core-js/features/array-buffer';
import 'core-js/features/string/repeat';
import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
