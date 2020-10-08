import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../login';
import {isTSAnyKeyword} from '@babel/types';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Login />, div);
})

// it("renders login correctly", () => {
//     const {getByTestId} = render(<Login />);
//     expect(getByTestId('login')).toHaveTextContent();

// })