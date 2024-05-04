import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  jest.setTimeout(15000); // Aumentar el tiempo de espera a 15 segundos
  render(<App />);
  await waitFor(
    () => {
      const linkElement = screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'Iniciar Sesión';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
          (child) => !hasText(child)
        );

        return nodeHasText && childrenDontHaveText;
      });
      console.log(linkElement);
      expect(linkElement).toBeInTheDocument();
    }
  );
});

