import * as PIXI from 'pixi.js';
import { APP_HEIGHT_PX, APP_WIDTH_PX, MODAL_HEIGHT, MODAL_WIDTH } from 'src/game/consts/config';
import { GAME_OVER, GAME_TITLE } from 'src/game/consts/strings';
import { COLOR_APP_BG } from 'src/game/consts/style';
import { renderButton } from 'src/game/helpers/graphicsUtils';

type TScreenType = 'home' | 'game' | 'gameOver';

interface IScreenState {
  app: PIXI.Application | null;
  screenContainer: PIXI.Container | null;
  currentScreenType: TScreenType;
  modalContainer: PIXI.Container | null;
}

// Controller for UI elements in menus and main screen
const ScreenController = (() => {
  const state: IScreenState = {
    app: null,
    screenContainer: null,
    currentScreenType: 'home',
    modalContainer: null,
  };

  const handlers = {
    onGameStart: null,
  };

  // get app and bind to controller
  const initialize = async () => {
    const app = new PIXI.Application<HTMLCanvasElement>({ width: APP_WIDTH_PX, height: APP_HEIGHT_PX });
    state.app = app;

    const background = new PIXI.Graphics().beginFill(COLOR_APP_BG).drawRect(0, 0, app.view.width, app.view.height);
    app.stage.addChild(background);

    const screenContainer = new PIXI.Container();
    app.stage.addChild(screenContainer);
    state.screenContainer = screenContainer;

    const modalContainer = new PIXI.Container();
    app.stage.addChild(modalContainer);
    state.modalContainer = modalContainer;

    setCurrentScreen('home');
    return app;
  };

  const setCurrentScreen = (screen: TScreenType, context?: any) => {
    state.currentScreenType = screen;
    switch (screen) {
      case 'home':
        renderHomeScreen();
        break;
      case 'game':
        renderGameScreen();
        break;
      case 'gameOver':
        renderGameOverScreen(context);
        break;
    }
  };

  const renderSplashScreen = () => {
    console.log('splash');
  };

  const renderHomeScreen = () => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    const title = new PIXI.Text(GAME_TITLE, { fill: 0xffffff });
    title.anchor.set(0.5);
    title.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2);
    screenContainer.addChild(title);

    const button = renderButton({ text: 'START', onClick: () => setCurrentScreen('game') });
    button.position.set(APP_WIDTH_PX / 2 - 75, APP_HEIGHT_PX / 2 + 50);
    screenContainer.addChild(button);
  };

  const renderGameScreen = async () => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    if (handlers.onGameStart) handlers.onGameStart();
  };

  const renderGameOverScreen = (context) => {
    const { screenContainer } = state;
    if (!screenContainer) return;
    screenContainer.removeChildren();

    const text = new PIXI.Text(GAME_OVER, { fill: 'white' });
    text.anchor.set(0.5);
    text.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2);
    screenContainer.addChild(text);

    if (context?.stats) {
      const { stats } = context;
      const statsText = new PIXI.Text(`Score: ${stats.coins} Coins\nTurns: ${stats.turns}`, { fill: 'white' });
      statsText.anchor.set(0.5);
      statsText.position.set(APP_WIDTH_PX / 2, APP_HEIGHT_PX / 2 + 75);
      screenContainer.addChild(statsText);
    }

    const button = renderButton({ text: 'RESTART', onClick: () => setCurrentScreen('game') });
    button.position.set(APP_WIDTH_PX / 2 - 75, APP_HEIGHT_PX / 2 + 125);
    screenContainer.addChild(button);
  };

  const renderModal = ({ width = MODAL_WIDTH, height = MODAL_HEIGHT }) => {
    const { modalContainer } = state;
    if (!modalContainer) return;
    modalContainer.removeChildren();

    const modal = new PIXI.Graphics().beginFill('red', 0.5).drawRect(0, 0, width, height);
    modal.position.set(APP_WIDTH_PX / 2 - width / 2, APP_HEIGHT_PX / 2 - height / 2);
    modalContainer.addChild(modal);

    return modal;
  };

  const closeModal = () => {
    const { modalContainer } = state;
    if (!modalContainer) return;
    modalContainer.removeChildren();
  };

  return {
    initialize,
    setCurrentScreen,
    renderModal,
    closeModal,

    getApp: () => state.app,
    getContainer: () => state.screenContainer,

    onGameStart: (callback) => (handlers.onGameStart = callback),
  };
})();

export default ScreenController;