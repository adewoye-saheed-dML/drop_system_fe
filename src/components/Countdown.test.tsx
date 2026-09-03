import {
    describe,
    expect,
    it,
    vi,
  } from 'vitest';
  
  import {
    render,
    screen,
  } from '@testing-library/react';
  
  import Countdown
    from './Countdown';
  
  describe('Countdown', () => {
    it('shows expired for a past expiration time', () => {
      render(
        <Countdown
          expiresAt={
            new Date(
              Date.now() - 5000,
            ).toISOString()
          }
        />,
      );
  
      expect(
        screen.getByText('Expired'),
      ).toBeInTheDocument();
    });
  
    it('calls onExpired for an already expired reservation', () => {
      const onExpired = vi.fn();
  
      render(
        <Countdown
          expiresAt={
            new Date(
              Date.now() - 5000,
            ).toISOString()
          }
          onExpired={onExpired}
        />,
      );
  
      expect(onExpired)
        .toHaveBeenCalled();
    });
  });