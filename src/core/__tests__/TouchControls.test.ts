import { TouchControls } from '../TouchControls';
import { KeyState } from '../../KeyState';

describe('TouchControls', () => {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let keys: KeyState;
    let touchControls: TouchControls;

    beforeEach(() => {
        // Configurar o ambiente de teste
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        keys = {
            'ArrowLeft': false,
            'ArrowRight': false,
            'ArrowUp': false,
            ' ': false
        };
        touchControls = new TouchControls(canvas, ctx, keys);
    });

    const createTouchEvent = (type: string, touches: Array<{ clientX: number; clientY: number }>) => {
        // Simular o getBoundingClientRect do canvas
        const rect = { left: 0, top: 0, width: canvas.width, height: canvas.height };
        Object.defineProperty(canvas, 'getBoundingClientRect', {
            value: () => rect,
            configurable: true
        });

        const touchList = touches.map(t => ({
            clientX: t.clientX,
            clientY: t.clientY,
            identifier: 0,
            target: canvas,
            screenX: t.clientX,
            screenY: t.clientY,
            pageX: t.clientX,
            pageY: t.clientY,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0,
            force: 1,
        } as Touch));

        return new TouchEvent(type, {
            touches: touchList,
            changedTouches: touchList,
            targetTouches: touchList,
            bubbles: true,
            cancelable: true
        });
    };

    test('deve atualizar KeyState quando tocar no botão esquerdo', () => {
        // Simular toque no botão esquerdo (posição aproximada)
        const touchEvent = createTouchEvent('touchstart', [{
            clientX: 20,
            clientY: canvas.height - 84
        }]);

        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowLeft']).toBe(true);
        expect(keys['ArrowRight']).toBe(false);
    });

    test('deve atualizar KeyState quando tocar no botão direito', () => {
        const touchEvent = createTouchEvent('touchstart', [{
            clientX: 94,
            clientY: canvas.height - 84
        }]);

        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowRight']).toBe(true);
        expect(keys['ArrowLeft']).toBe(false);
    });

    test('deve atualizar KeyState quando tocar no botão de pulo', () => {
        const touchEvent = createTouchEvent('touchstart', [{
            clientX: canvas.width - 138,
            clientY: canvas.height - 84
        }]);

        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowUp']).toBe(true);
    });

    test('deve atualizar KeyState quando tocar no botão de tiro', () => {
        const touchEvent = createTouchEvent('touchstart', [{
            clientX: canvas.width - 84,
            clientY: canvas.height - 84
        }]);

        canvas.dispatchEvent(touchEvent);
        expect(keys[' ']).toBe(true);
    });

    test('deve resetar KeyState quando o toque terminar', () => {
        // Primeiro simula um toque
        const touchStartEvent = createTouchEvent('touchstart', [{
            clientX: 20,
            clientY: canvas.height - 84
        }]);

        canvas.dispatchEvent(touchStartEvent);
        expect(keys['ArrowLeft']).toBe(true);

        // Depois simula o fim do toque
        const touchEndEvent = createTouchEvent('touchend', []);
        canvas.dispatchEvent(touchEndEvent);

        expect(keys['ArrowLeft']).toBe(false);
        expect(keys['ArrowRight']).toBe(false);
        expect(keys['ArrowUp']).toBe(false);
        expect(keys[' ']).toBe(false);
    });

    test('deve permitir múltiplos toques simultâneos', () => {
        const touchEvent = createTouchEvent('touchstart', [
            { clientX: 20, clientY: canvas.height - 84 },  // Botão esquerdo
            { clientX: canvas.width - 84, clientY: canvas.height - 84 }  // Botão de tiro
        ]);

        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowLeft']).toBe(true);
        expect(keys[' ']).toBe(true);
        expect(keys['ArrowRight']).toBe(false);
        expect(keys['ArrowUp']).toBe(false);
    });

    test('deve responder ao toque em diferentes áreas do botão', () => {
        // Testando toque no centro do botão esquerdo
        let touchEvent = createTouchEvent('touchstart', [{
            clientX: 20,
            clientY: canvas.height - 84
        }]);
        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowLeft']).toBe(true);

        // Testando toque na borda do botão esquerdo
        touchEvent = createTouchEvent('touchstart', [{
            clientX: 52, // Borda direita do botão
            clientY: canvas.height - 84
        }]);
        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowLeft']).toBe(true);

        // Testando toque fora do botão
        touchEvent = createTouchEvent('touchstart', [{
            clientX: 5,
            clientY: canvas.height - 20
        }]);
        canvas.dispatchEvent(touchEvent);
        expect(keys['ArrowLeft']).toBe(false);
    });

    test('deve manter o estado durante movimentação do toque', () => {
        // Inicia o toque no botão esquerdo
        const touchStartEvent = createTouchEvent('touchstart', [{
            clientX: 20,
            clientY: canvas.height - 84
        }]);
        canvas.dispatchEvent(touchStartEvent);
        expect(keys['ArrowLeft']).toBe(true);

        // Move o toque para o botão direito
        const touchMoveEvent = createTouchEvent('touchmove', [{
            clientX: 94,
            clientY: canvas.height - 84
        }]);
        canvas.dispatchEvent(touchMoveEvent);
        expect(keys['ArrowLeft']).toBe(false);
        expect(keys['ArrowRight']).toBe(true);
    });
});