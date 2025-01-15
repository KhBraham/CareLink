import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../../core/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chat Button -->
    <button
      *ngIf="!isChatOpen"
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 bg-[#1e2756] text-white p-4 rounded-full shadow-lg hover:bg-[#2a3572] transition-colors z-50"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div
      *ngIf="isChatOpen"
      class="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col z-50"
    >
      <!-- Header -->
      <div class="bg-[#1e2756] text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 class="text-lg font-semibold">CareLink Assistant</h3>
        <button
          (click)="toggleChat()"
          class="text-white hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 p-4 overflow-y-auto" #messageContainer>
        <div
          *ngFor="let message of messages"
          class="mb-4"
          [ngClass]="{'flex justify-end': message.role === 'user'}"
        >
          <div
            class="max-w-[80%] p-3 rounded-lg"
            [ngClass]="{
              'bg-[#1e2756] text-white': message.role === 'user',
              'bg-gray-100': message.role === 'assistant'
            }"
          >
            <p class="text-sm">{{ message.content }}</p>
            <span class="text-xs opacity-70 mt-1 block">
              {{ message.timestamp | date:'shortTime' }}
            </span>
          </div>
        </div>
        <div *ngIf="isLoading" class="flex justify-start mb-4">
          <div class="bg-gray-100 p-3 rounded-lg">
            <div class="flex space-x-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t">
        <div class="flex space-x-2">
          <input
            type="text"
            [(ngModel)]="currentMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            class="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#1e2756]"
            [disabled]="isLoading"
          >
          <button
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || isLoading"
            class="bg-[#1e2756] text-white px-4 py-2 rounded-lg hover:bg-[#2a3572] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ChatbotComponent {
  isChatOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {
    // Add initial welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hello! I\'m your CareLink virtual assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.currentMessage.trim(),
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.currentMessage = '';
    this.isLoading = true;

    // Get response from chatbot service
    this.chatbotService.sendMessage(userMessage.content, this.messages).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chatbot error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble responding right now. Please try again later.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }
}
