import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SearchBar } from '../../components/SearchBar';

function SearchBarWrapper() {
  const [text, setText] = useState('');
  return <SearchBar value={text} onChangeText={setText} placeholder="ค้นหากิจกรรม..." />;
}

describe('Integration Test: SearchBar', () => {
  it('renders search input and updates value on typing', async () => {
    const { getByTestId, queryByTestId } = await render(<SearchBarWrapper />);

    const input = getByTestId('search-input');
    expect(input.props.value).toBe('');
    // Clear button should not be visible when input is empty
    expect(queryByTestId('search-clear')).toBeNull();

    fireEvent.changeText(input, 'Hackathon');

    await waitFor(() => {
      expect(getByTestId('search-input').props.value).toBe('Hackathon');
      // Clear button should be visible now
      expect(getByTestId('search-clear')).toBeTruthy();
    });

    // Pressing clear resets the input
    const clearBtn = getByTestId('search-clear');
    fireEvent.press(clearBtn);

    await waitFor(() => {
      expect(getByTestId('search-input').props.value).toBe('');
    });
  });
});
