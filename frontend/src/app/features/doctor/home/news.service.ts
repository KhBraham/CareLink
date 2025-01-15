import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsResponse } from './news.types';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getHealthNews(): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/news/health`);
  }
}
