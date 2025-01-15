import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly SYSTEM_PROMPT = `You are a helpful healthcare assistant for CareLink Hospital. 
  Your role is to:
  - Provide general health information and guidance
  - Help patients understand medical terms
  - Assist with hospital services and appointment information
  - Direct patients to appropriate medical resources
  - Never provide specific medical diagnosis or treatment advice
  - Always recommend consulting a doctor for specific medical concerns
  
  Keep responses professional, clear, and concise.`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string, conversationHistory: ChatMessage[]): Observable<any> {
    const messages = [
      { role: 'system', content: this.SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    return this.http.post(`${environment.apiUrl}/chatbot`, { messages });
  }
}
