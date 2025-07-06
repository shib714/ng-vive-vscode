import { Injectable, signal } from '@angular/core';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly _contacts = signal<Contact[]>([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '234-567-8901' },
  ]);

  readonly contacts = this._contacts.asReadonly();

  addContact(contact: Omit<Contact, 'id'>) {
    const contacts = this._contacts();
    const id = contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    this._contacts.set([...contacts, { ...contact, id }]);
  }

  updateContact(updated: Contact) {
    this._contacts.set(this._contacts().map(c => c.id === updated.id ? updated : c));
  }

  deleteContact(id: number) {
    this._contacts.set(this._contacts().filter(c => c.id !== id));
  }
}
