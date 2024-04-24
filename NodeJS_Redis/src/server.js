const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();
app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
  try {
    const items = await redis.lrange('todo', 0, -1);
    res.json(items);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});

// Tạo một Todo mới
app.post('/todos', async (req, res) => {
  try {
    const todoName = req.body.title;
    await redis.rpush('todo', todoName || 'Unknown todo');
    res.status(201).send('Todo đã được thêm thành công');
  } catch (error) {
    console.error('Lỗi khi thêm Todo mới vào Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi thêm Todo mới vào Redis');
  }
});

// Lấy thông tin của một Todo cụ thể
app.get('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoInfo = await redis.lindex('todo', todoId);
    if (!todoInfo) {
      return res.status(404).send('Không tìm thấy Todo');
    }
    res.send(todoInfo);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});

// Cập nhật thông tin của một Todo
app.put('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const newTodoName = req.body.title;
    const result = await redis.lset('todo', todoId, newTodoName);

    if (result !== 'OK') {
      return res.status(500).send('Không thể cập nhật thông tin của Todo');
    }

    res.send('Thông tin của Todo đã được cập nhật thành công');
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin của Todo trong Redis: ', error);
    res
      .status(500)
      .send('Đã xảy ra lỗi khi cập nhật thông tin của Todo trong Redis');
  }
});

// Xóa thông tin của một Todo cụ thể dựa trên chỉ số (index)
app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoInfo = await redis.lindex('todo', todoId);
    if (!todoInfo) {
      return res.status(404).send('Không tìm thấy Todo');
    }

    const result = await redis.lrem('todo', 0, todoInfo);

    if (result === 0) {
      return res.status(500).send('Không thể xóa Todo');
    }

    res.send('Todo đã được xóa thành công');
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi xóa dữ liệu từ Redis');
  }
});

//* Completed Todo
app.get('/completeTodos', async (req, res) => {
  try {
    const items = await redis.lrange('completeTodo', 0, -1);
    res.json(items);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});
app.post('/completeTodos', async (req, res) => {
  try {
    const completeTodoName = req.body.title;
    await redis.rpush(
      'completeTodo',
      completeTodoName || 'Unknown completedTodo'
    );
    res.status(201).send('Completed Todo đã được thêm thành công');
  } catch (error) {
    console.error('Lỗi khi thêm Completed Todo mới vào Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi thêm Completed Todo mới vào Redis');
  }
});
app.get('/completeTodos/:id', async (req, res) => {
  try {
    const completeTodoId = req.params.id;
    const completeTodoInfo = await redis.lindex('completeTodo', completeTodoId);
    if (!completeTodoInfo) {
      return res.status(404).send('Không tìm thấy Completed Todo');
    }
    res.send(completeTodoInfo);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});
app.delete('/completeTodos/:id', async (req, res) => {
  try {
    const completeTodoId = req.params.id;
    const completeTodoInfo = await redis.lindex('completeTodo', completeTodoId);
    if (!completeTodoInfo) {
      return res.status(404).send('Không tìm thấy Todo');
    }

    const result = await redis.lrem('completeTodo', 0, completeTodoInfo);

    if (result === 0) {
      return res.status(500).send('Không thể xóa Completed Todo');
    }

    res.send('Completed Todo đã được xóa thành công');
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi xóa dữ liệu từ Redis');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Máy chủ Express đang chạy trên cổng ${PORT}`);
});
