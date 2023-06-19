import { useEffect, useState } from 'react';
import controller from './controller';

const Renderer = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function load() {
      const app = await controller.initialize();
      const node = document.getElementById('pixi-root');
      if (node && !isInitialized) {
        setIsInitialized(true);
        node.appendChild(app.view);
      }
    }

    load();
  }, [isInitialized]);

  return <div id="pixi-root" />;
};

export default Renderer;