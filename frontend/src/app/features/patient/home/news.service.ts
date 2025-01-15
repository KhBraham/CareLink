import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { NewsResponse } from './news.types';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getHealthNews(): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.API_URL}/news/health`).pipe(
      map(response => {
        // Ensure we have valid data
        response.articles = response.articles.map(article => ({
          ...article,
          // Provide fallbacks for optional fields
          author: article.author || 'Unknown Author',
          description: article.description || 'No description available',
          content: article.content || null,
          urlToImage: article.urlToImage || null
        }));
        return response;
      }),
      catchError(error => {
        console.error('Error fetching health news:', error);
        // Return an empty response instead of throwing
        return of({
          status: 'error',
          totalResults: 0,
          articles: []
        });
      })
    );
  }
}
