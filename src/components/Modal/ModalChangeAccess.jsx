import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../Home/Home.css';
import PropTypes from 'prop-types';
import { AddAccess, RemoveAccess } from '../../api/accessApi';
import { getUserDbRequest, GetDBList } from '../../api/userApi';
import { getUserSession } from '../../helpers/storage';

function updateAcc(accessOptions, accState, userId) {
  RemoveAccess(
    userId,
    accessOptions.filter((_, index) => accState[index] === false).map((item) => item.dbName),
  );
}

function updateNoAcc(noAccessOptions, noAccState, userId) {
  AddAccess(
    userId,
    noAccessOptions.filter((_, index) => noAccState[index] === false).map((item) => item.dbName),
  );
}

Modal.setAppElement('#root');

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

const ModalChangeAccess = ({ onClose, userId }) => {
  const [accessOptions, setAccessOptions] = useState([]);
  const [noAccessOptions, setNoAccessOptions] = useState([]);

  const [checkedStateAcc, setCheckedStateAcc] = useState(new Array(100).fill(true));

  const [checkedStateNoAcc, setCheckedStateNoAcc] = useState(new Array(100).fill(false));

  useEffect(() => {
    GetDBList().then((items) => {
      const newAccessOptions = items.map((element) => element.Database);
      setNoAccessOptions(newAccessOptions);
    });

    const { id: userId } = getUserSession();

    getUserDbRequest(userId).then((items) => {
      const newUserAccessDB = items.map((element) => ({
        user_id: element.user_id,
        dbName: element.dbName,
        level: element.access_level,
      }));
      setAccessOptions(newUserAccessDB);
    });
  }, []);

  useEffect(() => {
    // if (accessOptions !== undefined) {
    //   let filteredNoAccess = [];
    //   noAccessOptions.forEach(element => {
    //     accessOptions.forEach(el => {
    //       if (el.dbName === element) {
    //         filteredNoAccess = arrayRemove(noAccessOptions, element);
    //       }
    //     });
    //   });
    //   setNoAccessOptions(filteredNoAccess);
    // }
  }, [accessOptions]);

  const handleSubmit = (event) => {
    event.preventDefault();

    updateAcc(accessOptions, checkedStateAcc, userId);
    updateNoAcc(noAccessOptions, checkedStateNoAcc, userId);

    onClose(false);
  };

  const handleOnChangeAcc = (position) => {
    const updatedCheckedStateAcc = checkedStateAcc.map((item, index) => (index === position ? !item : item));

    setCheckedStateAcc(updatedCheckedStateAcc);
  };

  const handleOnChangeNoAcc = (position) => {
    const updatedCheckedStateNoAcc = checkedStateNoAcc.map((item, index) => (index === position ? !item : item));

    setCheckedStateNoAcc(updatedCheckedStateNoAcc);
  };

  return (
    <Modal className="modal2" onClick={onClose} isOpen onRequestClose={onClose} contentLabel="My dialog">
      <form onSubmit={handleSubmit}>
        <div className="form">
          {accessOptions.map((option, index) => (
            <label key={option.dbName} className="label3">
              {option.dbName}
              <input type="checkbox" checked={checkedStateAcc[index]} name={option.dbName} onChange={() => handleOnChangeAcc(index)} />
              <br />
            </label>
          ))}
          {noAccessOptions.map((option, index) => (
            <label key={option} className="label3">
              {option}
              <input type="checkbox" checked={checkedStateNoAcc[index]} name={option} onChange={() => handleOnChangeNoAcc(index)} />
              <br />
            </label>
          ))}
        </div>
        <input className="button" type="submit" value="Submit" />
      </form>
      <button className="button" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

ModalChangeAccess.propTypes = {
  userId: PropTypes.string,
};

export default ModalChangeAccess;
