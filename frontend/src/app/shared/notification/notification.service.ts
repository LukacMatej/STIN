import {Injectable} from '@angular/core'
import swal from 'sweetalert2'

/**
 * Service to handle notifications such as success and error messages.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Displays a success notification with the provided message.
   *
   * @param successMessage
   */
  successNotification(successMessage: string): void {
    swal.fire({
      position: 'top-right',
      icon: 'success',
      title: successMessage,
      showConfirmButton: false,
      timer: 3000,
      toast: true
    })
  }

  /**
   * Displays an error notification with the provided message.
   *
   * @param errorMessage
   */
  errorNotification(errorMessage: string): void {
    swal.fire({
      position: 'top-right',
      icon: 'error',
      title: errorMessage,
      showConfirmButton: false,
      timer: 3000,
      toast: true
    })
  }
}
