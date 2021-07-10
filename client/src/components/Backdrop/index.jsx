/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import ReactDOM from 'react-dom';

import './Backdrop.css';

function Backdrop({ onClick }) {
  return ReactDOM.createPortal(
    <div className="Backdrop" onClick={onClick} />,
    document.getElementById('backdrop-hook')
  );
}

export default Backdrop;
