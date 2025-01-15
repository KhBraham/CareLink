import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';
import { NewsArticle } from './news.types';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col">
      <!-- News Section -->
      <section class="py-12 bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center text-[#1e2756] mb-12">Latest Health News</h2>
          
          <ng-container *ngIf="isLoading; else errorOrNews">
            <div class="flex justify-center items-center h-32">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e2756]"></div>
            </div>
          </ng-container>
          <ng-template #errorOrNews>
            <ng-container *ngIf="error; else noNewsOrNews">
              <div class="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                {{ error }}
              </div>
            </ng-container>
            <ng-template #noNewsOrNews>
              <ng-container *ngIf="newsArticles.length === 0; else news">
                <div class="text-center text-gray-600 p-4">
                  No news articles available at the moment.
                </div>
              </ng-container>
              <ng-template #news>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <article *ngFor="let article of newsArticles; trackBy: trackArticle" class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div class="relative aspect-video">
                      <img 
                        [src]="article.urlToImage || 'assets/images/news-placeholder.svg'" 
                        [alt]="article.title"
                        class="w-full h-full object-cover"
                        (error)="handleImageError($event)"
                      >
                      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div class="text-white text-sm flex items-center gap-2">
                          <span class="font-medium">{{ article.source.name }}</span>
                          <span class="text-white/80">•</span>
                          <time [dateTime]="article.publishedAt" class="text-white/80">
                            {{ article.publishedAt | date:'MMM d, y' }}
                          </time>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-6">
                      <h3 class="text-lg font-semibold text-[#1e2756] mb-2 line-clamp-2 hover:text-blue-600">
                        <a [href]="article.url" target="_blank" class="hover:underline">
                          {{ article.title }}
                        </a>
                      </h3>
                      
                      <ng-container *ngIf="article.author">
                        <p class="text-sm text-gray-600 mb-3">
                          By {{ article.author }}
                        </p>
                      </ng-container>
                      
                      <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {{ article.description }}
                      </p>
                      
                      <a 
                        [href]="article.url" 
                        target="_blank" 
                        class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                      >
                        Read Full Article
                        <svg 
                          class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                </div>
              </ng-template>
            </ng-template>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .aspect-video {
      aspect-ratio: 16 / 9;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class HomeComponent implements OnInit {
  newsArticles: NewsArticle[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  private loadNews() {
    this.isLoading = true;
    this.error = null;
    
    this.newsService.getHealthNews().subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          this.newsArticles = response.articles.slice(0, 9); // Show top 9 articles
        } else {
          this.error = 'Unable to load news articles';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.error = 'Unable to load news articles. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/news-placeholder.svg';
  }

  trackArticle(index: number, article: NewsArticle) {
    return article.title;
  }

  trackIndex(index: number) {
    return index;
  }
}
