import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Organization } from '../models/org.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private readonly USER_KEY = 'admin_users_v1';
  private readonly ORG_KEY = 'admin_orgs_v1';

  private users$ = new BehaviorSubject<User[]>(this.loadUsers());
  private orgs$ = new BehaviorSubject<Organization[]>(this.loadOrgs());

  constructor() {}

  // --- Users ---
  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  addUser(payload: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...payload,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const next = [newUser, ...this.users$.value];
    this.setUsers(next);
    return newUser;
  }

  updateUser(id: string, patch: Partial<User>) {
    const next = this.users$.value.map(u => (u.id === id ? { ...u, ...patch } : u));
    this.setUsers(next);
  }

  deleteUser(id: string) {
    const next = this.users$.value.filter(u => u.id !== id);
    this.setUsers(next);
  }

  // --- Orgs ---
  getOrgs(): Observable<Organization[]> {
    return this.orgs$.asObservable();
  }

  addOrg(payload: Omit<Organization, 'id' | 'createdAt'>) {
    const newOrg: Organization = {
      ...payload,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const next = [newOrg, ...this.orgs$.value];
    this.setOrgs(next);
    return newOrg;
  }

  updateOrg(id: string, patch: Partial<Organization>) {
    const next = this.orgs$.value.map(o => (o.id === id ? { ...o, ...patch } : o));
    this.setOrgs(next);
  }

  deleteOrg(id: string) {
    const next = this.orgs$.value.filter(o => o.id !== id);
    this.setOrgs(next);
  }

  // --- persistence helpers ---
  private setUsers(list: User[]) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(list));
    this.users$.next(list);
  }

  private setOrgs(list: Organization[]) {
    localStorage.setItem(this.ORG_KEY, JSON.stringify(list));
    this.orgs$.next(list);
  }

  private loadUsers(): User[] {
    const raw = localStorage.getItem(this.USER_KEY);
    if (raw) return JSON.parse(raw) as User[];
    // default sample users:
    const sample: User[] = [
      { id: uuidv4(), name: 'Omar Adel', email: 'omar@example.com', role: 'admin', phone: '01000000000', active: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'Sara Ali', email: 'sara@example.com', role: 'manager', phone: '01011111111', active: true, createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'John Doe', email: 'john@example.com', role: 'user', phone: '01022222222', active: false, createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(this.USER_KEY, JSON.stringify(sample));
    return sample;
  }

  private loadOrgs(): Organization[] {
    const raw = localStorage.getItem(this.ORG_KEY);
    if (raw) return JSON.parse(raw) as Organization[];
    const sample: Organization[] = [
      { id: uuidv4(), name: 'ABC Hospital', address: 'XYZ Road, District', contact: '022000000', createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'Red Cross Center', address: 'Main St', contact: '022111111', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(this.ORG_KEY, JSON.stringify(sample));
    return sample;
  }
}
