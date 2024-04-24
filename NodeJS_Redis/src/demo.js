const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();
app.use(express.json());

app.get('/players', async (req, res) => {
  try {
    const items = await redis.lrange('player', 0, -1);
    res.json(items);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});

// Tạo một người chơi mới
app.post('/players', async (req, res) => {
  try {
    const playerName = req.body.name; // Giả sử tên người chơi được gửi qua body của yêu cầu
    await redis.rpush('player', playerName || 'Unknown Player'); // Thêm playerName vào cuối danh sách 'player' trong Redis, nếu không có playerName thì sử dụng 'Unknown Player' làm giá trị mặc định
    res.status(201).send('Người chơi đã được thêm thành công');
  } catch (error) {
    console.error('Lỗi khi thêm người chơi mới vào Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi thêm người chơi mới vào Redis');
  }
});

// Lấy thông tin của một người chơi cụ thể
app.get('/players/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    const playerInfo = await redis.lindex('player', playerId); // Lấy phần tử tại chỉ số (index) tương ứng với id
    if (!playerInfo) {
      return res.status(404).send('Không tìm thấy người chơi');
    }
    res.send(playerInfo); // Trả về chuỗi văn bản đơn giản từ Redis
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi lấy dữ liệu từ Redis');
  }
});

// Cập nhật thông tin của một người chơi
app.put('/players/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    const newPlayerName = req.body.name; // Giả sử tên người chơi mới được gửi qua body của yêu cầu
    const result = await redis.lset('player', playerId, newPlayerName);

    if (result !== 'OK') {
      return res
        .status(500)
        .send('Không thể cập nhật thông tin của người chơi');
    }

    res.send('Thông tin của người chơi đã được cập nhật thành công');
  } catch (error) {
    console.error(
      'Lỗi khi cập nhật thông tin của người chơi trong Redis: ',
      error
    );
    res
      .status(500)
      .send('Đã xảy ra lỗi khi cập nhật thông tin của người chơi trong Redis');
  }
});

// Xóa thông tin của một người chơi cụ thể dựa trên chỉ số (index)
app.delete('/players/:id', async (req, res) => {
  try {
    const playerId = req.params.id;
    const playerInfo = await redis.lindex('player', playerId); // Lấy phần tử tại chỉ số (index) tương ứng với id
    if (!playerInfo) {
      return res.status(404).send('Không tìm thấy người chơi');
    }

    // Sử dụng lệnh LREM để xóa giá trị tại chỉ số (index)
    const result = await redis.lrem('player', 0, playerInfo);

    if (result === 0) {
      return res.status(500).send('Không thể xóa người chơi');
    }

    res.send('Người chơi đã được xóa thành công');
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Redis: ', error);
    res.status(500).send('Đã xảy ra lỗi khi xóa dữ liệu từ Redis');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Máy chủ Express đang chạy trên cổng ${PORT}`);
});
