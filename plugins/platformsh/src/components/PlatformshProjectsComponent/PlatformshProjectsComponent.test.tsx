import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlatformshProjectsComponent } from './PlatformshProjectsComponent';

describe('PlatformshProjectsComponent', () => {
  it('renders the projects table', async () => {
    render(<PlatformshProjectsComponent />);

    // Wait for the table to render
    const table = await screen.findByRole('table');
    const nationality = screen.getAllByText('Projects');
    // Assert that the table contains the expected projects data
    expect(table).toBeInTheDocument();
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('us-east')).toBeInTheDocument();
    expect(nationality[0]).toBeInTheDocument();
  });
});
