import { Injectable, signal, computed } from '@angular/core';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private contacts = signal<Contact[]>([]);
  
  // Computed signal for sorted contacts
  sortedContacts = computed(() => {
    return this.contacts().sort((a, b) => 
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    );
  });

  constructor() {
    // Initialize with some sample data
    this.loadSampleData();
  }

  private loadSampleData(): void {
    const sampleContacts: Contact[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        mobile: true,
        company: 'Tech Corp',
        notes: 'Lead developer',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0456',
        mobile: false,
        company: 'Design Studio',
        notes: 'UI/UX Designer',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1-555-0789',
        mobile: true,
        company: 'Marketing Inc',
        notes: 'Marketing Manager',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      }
    ];
    
    this.contacts.set(sampleContacts);
  }

  addContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newContact: Contact = {
      ...contact,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.contacts.update(contacts => [...contacts, newContact]);
  }

  updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): void {
    this.contacts.update(contacts =>
      contacts.map(contact =>
        contact.id === id
          ? { ...contact, ...updates, updatedAt: new Date() }
          : contact
      )
    );
  }

  deleteContact(id: string): void {
    this.contacts.update(contacts => contacts.filter(contact => contact.id !== id));
  }

  getContactById(id: string): Contact | undefined {
    return this.contacts().find(contact => contact.id === id);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}