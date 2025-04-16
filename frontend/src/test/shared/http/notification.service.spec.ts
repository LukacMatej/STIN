import { NotificationService } from '../../../app/shared/notification/notification.service';
import swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it('should display a success notification', () => {
    const successMessage = 'Operation successful';
    service.successNotification(successMessage);

    expect(swal.fire).toHaveBeenCalledWith({
      position: 'top-right',
      icon: 'success',
      title: successMessage,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    });
  });

  it('should display an error notification', () => {
    const errorMessage = 'An error occurred';
    service.errorNotification(errorMessage);

    expect(swal.fire).toHaveBeenCalledWith({
      position: 'top-right',
      icon: 'error',
      title: errorMessage,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    });
  });

  it('should log a notification message to the console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const message = 'Test notification message';

    service.notify(message);

    expect(consoleSpy).toHaveBeenCalledWith(message);
    consoleSpy.mockRestore();
  });
});
