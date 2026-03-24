import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function DateWidget() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const n = new Date();
    setDateStr(`${n.getDate()}/${n.getMonth() + 1}/${n.getFullYear()}`);
  }, []);

  return (
    <Card title="Today's date" className="mt-2">
      <p className="para mb-0">{dateStr}</p>
    </Card>
  );
}