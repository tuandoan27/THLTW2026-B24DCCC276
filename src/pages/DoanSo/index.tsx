
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Alert, message } from 'antd';

const { Title, Text } = Typography;

const GuessNumberGame: React.FC = () => {
  const MAX_ATTEMPTS = 10;
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 100;

  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomNum =
      Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    setTargetNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameOver(false);
  };

  const handleGuess = () => {
    const guessNumber = parseInt(guess);

    if (!guess || isNaN(guessNumber)) {
      message.error('Vui lòng nhập một số hợp lệ!');
      return;
    }

    if (guessNumber < MIN_NUMBER || guessNumber > MAX_NUMBER) {
      message.error(`Vui lòng nhập số từ ${MIN_NUMBER} đến ${MAX_NUMBER}!`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNumber === targetNumber) {
      setFeedback('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else if (newAttempts >= MAX_ATTEMPTS) {
      setFeedback(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
      setGameOver(true);
    } else if (guessNumber < targetNumber) {
      setFeedback('Bạn đoán quá thấp!');
    } else {
      setFeedback('Bạn đoán quá cao!');
    }

    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !gameOver) {
      handleGuess();
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
           Game Đoán Số
        </Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Lượt đã chơi: </Text>
          <Text>
            {attempts} / {MAX_ATTEMPTS}
          </Text>
        </div>

        {feedback && (
          <Alert
            message={feedback}
            type={
              feedback.includes('đúng')
                ? 'success'
                : feedback.includes('hết lượt')
                ? 'error'
                : 'info'
            }
            style={{ marginBottom: 16 }}
          />
        )}

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text>Nhập số dự đoán (từ {MIN_NUMBER} đến {MAX_NUMBER}):</Text>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <Input
                size="large"
                placeholder="Nhập số..."
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={gameOver}
                type="number"
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleGuess}
                disabled={gameOver}
              >
                Đoán
              </Button>
            </div>
          </div>

          <Button
            type="default"
            size="large"
            onClick={startNewGame}
            block
            style={{ marginTop: 16 }}
          >
            Chơi lại
          </Button>
        </Space>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: '#f0f2f5',
            borderRadius: 4,
          }}
        >
          <Text strong>Hướng dẫn:</Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            <li>Hệ thống đã chọn một số từ 1 đến 100</li>
            <li>Bạn có 10 lượt để đoán</li>
            <li>Sau mỗi lần đoán, hệ thống sẽ gợi ý cao/thấp</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default GuessNumberGame;