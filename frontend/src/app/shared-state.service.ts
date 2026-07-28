import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  
  username = signal('XYZ');
  
  
  updateUsername(newName: string) {
    if (newName.trim()) {
      this.username.set(newName.trim());
    }
  }
}
