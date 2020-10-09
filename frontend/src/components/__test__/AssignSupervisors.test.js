import React from 'react';
import ReactDOM from 'react-dom';
import AssignSupervisors from '../coordinator/AssignSupervisors';
import CreateGroups from '../coordinator/CreateGroups';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AssignSupervisors />, div);
})

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateGroups />, div);
})