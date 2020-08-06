import React from 'react';
import { mount } from 'enzyme';
import Index from 'pages/index';

describe('index page', () => {
  it('should have App component', () => {
    const subject = mount(<Index />);

    // expect(subject.find('Layout')).toHaveLength(1);
  });
});

// import React from 'react';
// import Home from 'pages/index';
// import { render, fireEvent } from './testUtils';

// describe('Home page', () => {
//   it('matches snapshot', () => {
//     const { asFragment } = render(<Home />, {});
//     expect(asFragment()).toMatchSnapshot();
//   });

//   it('clicking button triggers alert', () => {
//     const { getByText } = render(<Home />, {});
//     window.alert = jest.fn();
//     fireEvent.click(getByText('Test Button'));
//     expect(window.alert).toHaveBeenCalledWith('With typescript and Jest');
//   });
// });
