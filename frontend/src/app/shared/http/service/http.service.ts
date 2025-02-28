import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

/**
 * Service to handle HTTP requests for interacting with backend APIs.
 * Uses injectable decorator to mark the service as injectable and provided at the root level.
 * This makes it a singleton service accessible throughout the entire application.
 */
@Injectable({providedIn: 'root'})
export class HttpService {
  private httpClient: HttpClient = inject(HttpClient)

  /**
   * Generic GET method for making HTTP GET requests.
   *
   * @param url
   * @param options
   * @returns An observable of type T, representing the response from the server.
   */
  get<T>(url: string, options = {}): Observable<T> {
    return this.httpClient.get<T>(url, options)
  }

  /**
   * Generic POST method for making HTTP POST requests.
   *
   * @param url
   * @param body
   * @param options
   * @returns An observable of type T, representing the response from the server.
   */
  post<T>(url: string, body: any, options = {}): Observable<T> {
    return this.httpClient.post<T>(url, body, options)
  }

  /**
   * Generic PUT method for making HTTP PUT requests.
   *
   * @param url
   * @param body
   * @param options
   * @returns An observable of type T, representing the response from the server.
   */
  put<T>(url: string, body: any, options = {}): Observable<T> {
    return this.httpClient.put<T>(url, body, options)
  }

  /**
   * Generic DELETE method for making HTTP DELETE requests.
   *
   * @param url
   * @param options
   * @returns An observable of type T, representing the response from the server.
   */
  delete<T>(url: string, options = {}): Observable<T> {
    return this.httpClient.delete<T>(url, options)
  }
}

