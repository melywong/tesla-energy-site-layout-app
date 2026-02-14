import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import DeviceSelector from '../components/DeviceSelector';

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe('DeviceSelector', () => {
  it('renders all battery types', () => {
    renderWithMantine(<DeviceSelector selections={[]} onChange={() => {}} />);
    expect(screen.getByLabelText('MegapackXL quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Megapack2 quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Megapack quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('PowerPack quantity')).toBeInTheDocument();
  });

  it('displays current selection values', () => {
    const selections = [{ deviceId: 'megapack', quantity: 5 }];
    renderWithMantine(<DeviceSelector selections={selections} onChange={() => {}} />);
    expect(screen.getByLabelText('Megapack quantity')).toHaveValue('5');
  });

  it('calls onChange when quantity changes', () => {
    const onChange = vi.fn();
    renderWithMantine(<DeviceSelector selections={[]} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Megapack quantity'), {
      target: { value: '3' },
    });
    expect(onChange).toHaveBeenCalledWith([{ deviceId: 'megapack', quantity: 3 }]);
  });
});
