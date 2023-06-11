import './App.css';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useRef, useState } from 'react';

function App() {
  const ydocRef = useRef(null);
  const yWebSocketProviderRef = useRef(null);
  const [text, setText] = useState('');

  useEffect(() => {
    ydocRef.current = new Y.Doc();

    yWebSocketProviderRef.current = new WebsocketProvider(
      'ws://localhost:1234',
      'roomname',
      ydocRef.current
    );

    const yText = ydocRef.current?.getText('textarea');
    if (yText) {
      const observer = () => {
        setText(yText.toString());
      };
      yText.observe(observer);
      return () => {
        yText.unobserve(observer);
      };
    }

    return () => {
      ydocRef.current?.destroy();
      yWebSocketProviderRef.current?.destroy();
    };
  }, []);

  const handleTextareaChange = (e) => {
    const yText = ydocRef.current?.getText('textarea');
    if (yText) {
      yText.delete(0, yText.length);
      yText.insert(0, e.target.value);
    }
  };

  return (
    <div className="App">
      <textarea
        rows={10}
        cols={50}
        value={text}
        onChange={handleTextareaChange}
      />
    </div>
  );
}

export default App;
