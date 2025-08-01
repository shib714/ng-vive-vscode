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

    {
        path: 'app-weather',
        loadComponent: () => import('./components/content-projection/app/weather-app')
            .then(m => m.WeatherApp), title: 'Content Projection'
    },
    {
        path: 'app-table',
        loadComponent: () => import('./components/ng-template/app-table/app-table')
            .then(m => m.AppTable), title: 'Content Projection'
    },

    {
        path: 'app-weather-template-outlet',
        loadComponent: () => import('./components/template-outlet/weather-app')
            .then(m => m.WeatherApp), title: 'NgTemplate Outlet Demo'
    },
    {
        path: 'text-editor',
        loadComponent: () => import('./components/text-editor/text-editor').then(m => m.TextEditorComponent),
        title: 'Text Editor'
    },
    { 
        path: 'dynamic-component', 
        loadComponent: () => import('./components/dynamic-component/dynamic-component').then((m) => m.DynamicComponent), 
        title: 'Dynamic component' 
    },
    { 
        path: 'dyna-component', 
        loadComponent: () => import('./components/dynamic-component-test/dynamic-component').then((m) => m.DynamicComponent), 
        title: 'Dynamic Widget component' 
    },
];
