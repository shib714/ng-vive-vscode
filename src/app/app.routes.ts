import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Home' },
    
    {
        path: 'home',
        loadComponent: () => import('./components/home/home')
            .then((m) => m.Home), title: 'Home'
    },
    
    {
        path: 'contacts',
        loadComponent: () => import('./components/contacts/contacts-list/contacts-list.component')
            .then(m => m.ContactsListComponent), title: 'Contacts'
    },
    
    {
        path: 'contacts/new',
        loadComponent: () => import('./components/contacts/contact-form/contact-form.component')
            .then(m => m.ContactFormComponent), title: 'New Contact'
    },

    {
        path: 'contacts/:id/edit',
        loadComponent: () => import('./components/contacts/contact-form/contact-form.component')
            .then(m => m.ContactFormComponent), title: 'Edit Contact'
    },

];
