import React, { useState } from 'react';
import { Card, Button, Space, Table, Tag } from 'antd';

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface GameHistory {
  id: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
}

const RockPaperScissors: React.FC = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);

  const getResult = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'Hòa';

    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }

    return 'Thua';
  };

  const handlePlay = (playerChoice: Choice) => {
    const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const result = getResult(playerChoice, computerChoice);

    const game: GameHistory = {
      id: Date.now(),
      playerChoice,
      computerChoice,
      result,
    };

    setHistory([game, ...history]);
  };

  const columns = [
    {
      title: 'Ván',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => history.length - index,
    },
    {
      title: 'Bạn chọn',
      dataIndex: 'playerChoice',
      key: 'playerChoice',
    },
    {
      title: 'Máy chọn',
      dataIndex: 'computerChoice',
      key: 'computerChoice',
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result: Result) => {
        const color =
          result === 'Thắng'
            ? 'success'
            : result === 'Thua'
            ? 'error'
            : 'default';
        return <Tag color={color}>{result}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Trò chơi Oẳn Tù Tì</h1>

      <Card style={{ marginBottom: 24 }}>
        <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
          <Button size="large" onClick={() => handlePlay('Kéo')}>
            Kéo
          </Button>
          <Button size="large" onClick={() => handlePlay('Búa')}>
            Búa
          </Button>
          <Button size="large" onClick={() => handlePlay('Bao')}>
            Bao
          </Button>
        </Space>
      </Card>

      <Card title="Lịch sử kết quả">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={history}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có ván nào' }}
        />
      </Card>
    </div>
  );
};

export default RockPaperScissors;