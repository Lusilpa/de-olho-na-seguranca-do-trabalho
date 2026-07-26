import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { describe, it, expect } from 'vitest';

describe('Home Component', () => {
  it('renders the De Olho na Segurança text', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    // Deve exibir o logo ou o texto da Hero
    expect(screen.getByText(/De Olho na/i)).toBeInTheDocument();
  });
});
