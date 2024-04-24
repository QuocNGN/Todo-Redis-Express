import { useEffect, useState } from 'react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { BsCheckAll } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import axios from 'axios';
import './App.scss';

function App() {
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState({ title: '' }); // Chỉnh sửa initial state của currentEditedItem;

  const apiUrl = 'http://localhost:3000';
  // Hàm gửi yêu cầu GET để lấy tất cả Todos từ máy chủ ExpressJS và Redis
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/todos`);
        const responseTodoDone = await axios.get(`${apiUrl}/completeTodos`);
        setAllTodos(response.data);
        setCompletedTodos(responseTodoDone.data);
        console.log(completedTodos);
      } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu từ máy chủ: ', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    try {
      let newTodoItem = {
        title: newTitle,
      };
      await axios.post(`${apiUrl}/todos`, newTodoItem);
      // Gửi yêu cầu GET để cập nhật danh sách todo
      const response = await axios.get(`${apiUrl}/todos`);
      setAllTodos(response.data);
      setNewTitle('');
    } catch (error) {
      console.error('Đã xảy ra lỗi khi thêm todo: ', error);
    }
  };
  const handleDeleteTodo = async (index) => {
    try {
      // Gửi yêu cầu DELETE để xóa todo
      await axios.delete(`${apiUrl}/todos/${index}`);
      // Gửi yêu cầu GET để cập nhật danh sách todo
      const response = await axios.get(`${apiUrl}/todos`);
      setAllTodos(response.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa todo: ', error);
    }
  };
  const timerLocal = () => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedDate = `${dd}/${mm}/${yyyy} at ${h}:${m}:${s}`;
    return completedDate;
  };
  // Hàm xử lý khi một mục được hoàn thành
  const handleCompleted = async (index) => {
    try {
      let filteredItem = {
        title: allTodos[index],
      };
      console.log(filteredItem);
      // completedDate: completedDate

      const checkPost = await axios.post(
        `${apiUrl}/completeTodos`,
        filteredItem
      );
      console.log(checkPost.data);

      handleDeleteTodo(index);

      const completeTodoResponse = await axios.get(`${apiUrl}/completeTodos`);
      console.log(completeTodoResponse.data);
      setCompletedTodos(completeTodoResponse.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi thêm todo: ', error);
    }
  };
  // Hàm xử lý khi xóa một mục từ danh sách "Completed"
  const handleDeleteCompletedTodo = async (index) => {
    try {
      // Gửi yêu cầu DELETE để xóa mục từ danh sách "Completed" dựa trên chỉ số
      await axios.delete(`${apiUrl}/completeTodos/${index}`);
      const response = await axios.get(`${apiUrl}/completeTodos`);
      setCompletedTodos(response.data);
    } catch (error) {
      console.error('Đã xảy ra lỗi khi xóa mục đã hoàn thành: ', error);
    }
  };
  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem({ title: item }); // Cập nhật currentEditedItem với giá trị của item
  };
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };
  const handleUpdateTodo = async () => {
    try {
      // Gửi yêu cầu PUT để cập nhật todo
      await axios.put(`${apiUrl}/todos/${currentEdit}`, currentEditedItem);
      // Gửi yêu cầu GET để cập nhật danh sách todo
      const response = await axios.get(`${apiUrl}/todos`);
      setAllTodos(response.data);
      setCurrentEdit('');
    } catch (error) {
      console.error('Đã xảy ra lỗi khi cập nhật todo: ', error);
    }
  };
  // Định nghĩa hàm handleCancelEdit
  const handleCancelEdit = () => {
    setCurrentEdit(-1); // Đặt currentEdit về một giá trị không liên quan đến index
    // Các xử lý khác nếu cần
  };

  return (
    <>
      <h1 className='neonText'>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input
              type='text'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
              name='title'
            />
          </div>
          <div className='todo-input-item'>
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
                    <div className='todo-list-item__title'>
                      <h6>{item}</h6>
                    </div>
                    <div className='d-flex align-items-center'>
                      <TbEdit
                        onClick={() => handleEdit(index, item)}
                        className='edit-icon'
                        title='Edit'
                      />
                      <BsCheckAll
                        onClick={() => handleCompleted(index)}
                        className='check-icon'
                        title='Check Done'
                      />
                      <RiDeleteBin5Fill
                        onClick={() => handleDeleteTodo(index)}
                        className='del-icon'
                        title='Delete'
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
                    <h6>
                      <del>{item}</del>
                    </h6>
                    <p>
                      <small>Completed on: {timerLocal()}</small>
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

export default App;
