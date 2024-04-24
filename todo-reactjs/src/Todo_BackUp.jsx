import { useEffect, useState } from 'react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { BsCheckAll } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';

import './App.scss';

function Todo_BackUp() {
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setAllTodos(updatedTodoArr);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoArr));
    setNewTitle('');
    setNewDescription('');
  };
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('todoList', JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  };
  const handleCompleted = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedDate = `${dd}/${mm}/${yyyy} at ${h}:${m}:${s}`;
    let filteredItem = {
      ...allTodos[index],
      completedDate: completedDate,
    };
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };
  const handleEdit = (index, item) => {
    console.log('>>> index: ', index);
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };
  const handleUpdateTodo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setAllTodos(newTodo);
    setCurrentEdit('');
    localStorage.setItem('todoList', JSON.stringify(newTodo));
  };
  // Định nghĩa hàm handleCancelEdit
  const handleCancelEdit = () => {
    setCurrentEdit(-1); // Đặt currentEdit về một giá trị không liên quan đến index
    // Các xử lý khác nếu cần
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todoList'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setAllTodos(savedTodo);
    }
    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  return (
    <>
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input
              type='text'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input
              type='text'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task Description?"
            />
          </div>
          <div className='todo-input-item'>
            <label>Title</label>
            <button
              type='button'
              onClick={handleAddTodo}
              className='primaryBtn'
            >
              ADD
            </button>
          </div>
        </div>

        <div className='btn-area'>
          <button
            className={`secondaryBtn ${
              isCompletedScreen === false && 'active'
            }`}
            onClick={() => setIsCompletedScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className='todo-list'>
          {isCompletedScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className='edit_wrapper' key={index}>
                    <input
                      placeholder='Updated Title'
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      rows={4}
                      placeholder='Updated Description'
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <div className='btn-zone'>
                      <button
                        type='button'
                        onClick={handleUpdateTodo}
                        className='primaryBtn'
                      >
                        Update
                      </button>
                      <button
                        type='button'
                        onClick={() => handleCancelEdit()}
                        className='primaryBtn'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className='todo-list-item' key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <RiDeleteBin5Fill
                        onClick={() => handleDeleteTodo(index)}
                        className='del-icon'
                        title='Delete'
                      />
                      <BsCheckAll
                        onClick={() => handleCompleted(index)}
                        className='check-icon'
                        title='Check Done'
                      />
                      <TbEdit
                        onClick={() => handleEdit(index, item)}
                        className='edit-icon'
                        title='Edit'
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isCompletedScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Completed on: {item.completedDate}</small>
                    </p>
                  </div>
                  <div>
                    <RiDeleteBin5Fill
                      onClick={() => handleDeleteCompletedTodo(index)}
                      className='del-icon'
                      title='Delete'
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Todo_BackUp;
