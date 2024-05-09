import React from "react";
import PropTypes from "prop-types";
import TS from 'bootstrap/js/src/toast';


const types = {
  success: {
    color: '--bs-success',
    title: 'Success',
  },
  error: {
    color: '--bs-danger',
    title: 'Error',
  },
  warning: {
    color: '--bs-warning',
    title: 'Warning',
  },
  info: {
    color: '--bs-info',
    title: 'Info',
  }
}

const Toast = ({ type = 'success', title, message }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id={"liveToast"} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header bg-body-secondary">
          <div id="toastColor" className="rounded me-2" style={{ height: '20px', width: '20px', backgroundColor: `var(${types[type]?.color})` }}></div>
          <strong id="toastTitle" className="me-auto">{title || types[type]?.title}</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div id="toastBody" className="toast-body">
          {message}
        </div>
      </div>
    </div>
  )
}

Toast.propTypes = {
  type: PropTypes.oneOf(['success','error','info','warning']),
  title: PropTypes.string,
  message: PropTypes.string,
}

export default Toast;

export const showToast = (type, message, title) => {
  const toastLiveExample = document.getElementById('liveToast');
  
  const toastColor = document.getElementById('toastColor');
  toastColor.style.backgroundColor = `var(${types[type]?.color})`;

  const toastTitle = document.getElementById('toastTitle');
  toastTitle.innerHTML = title || types[type]?.title;
  
  const toastBody = document.getElementById('toastBody');
  toastBody.innerHTML = message;

  const toastBootstrap = TS.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show()
}