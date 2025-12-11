import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../services/admin-data.service';
import { User } from '../models/user.model';
import { Organization } from '../models/org.model';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  sidebarCollapsed = false;
  activeView: 'overview' | 'users' | 'orgs' = 'overview';

  // Observables (kept for async updates)
  users$: Observable<User[]>;
  orgs$: Observable<Organization[]>;

  // Local arrays for manipulation
  users: User[] = [];
  orgs: Organization[] = [];

  // Derived arrays for display
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  filteredOrgs: Organization[] = [];

  usersCount = 0;
  orgsCount = 0;

  filterUsers = '';
  filterOrgs = '';

  usersPage = 1;
  usersPageSize = 6;

  userForm!: FormGroup;
  orgForm!: FormGroup;

  showUserModal = false;
  showOrgModal = false;

  editingUserId: string | null = null;
  editingOrgId: string | null = null;

  constructor(private adminService: AdminDataService, private fb: FormBuilder) {
    this.users$ = this.adminService.getUsers();
    this.orgs$ = this.adminService.getOrgs();
  }

  ngOnInit(): void {
    // Forms
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      phone: [''],
      active: [true],
    });

    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      contact: [''],
    });

    // Subscribe to data streams and initialize filtered/paginated lists
    this.users$.subscribe((list) => {
      this.users = list;
      this.usersCount = list.length;
      this.applyUserFilter();
    });

    this.orgs$.subscribe((list) => {
      this.orgs = list;
      this.orgsCount = list.length;
      this.applyOrgFilter();
    });
  }

  // -----------------------------
  // Sidebar
  // -----------------------------
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // -----------------------------
  // Filtering & Pagination (Users)
  // -----------------------------
  applyUserFilter() {
    const term = this.filterUsers.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }
    this.updateUserPagination();
  }

  updateUserPagination() {
    const start = (this.usersPage - 1) * this.usersPageSize;
    const end = start + this.usersPageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  nextUserPage() {
    if (this.usersPage * this.usersPageSize < this.filteredUsers.length) {
      this.usersPage++;
      this.updateUserPagination();
    }
  }

  prevUserPage() {
    if (this.usersPage > 1) {
      this.usersPage--;
      this.updateUserPagination();
    }
  }

  // -----------------------------
  // Filtering (Orgs)
  // -----------------------------
  applyOrgFilter() {
    const term = this.filterOrgs.toLowerCase().trim();
    if (!term) {
      this.filteredOrgs = [...this.orgs];
    } else {
      this.filteredOrgs = this.orgs.filter(
      (o) =>
    o.name.toLowerCase().includes(term) ||
    (o.address?.toLowerCase() ?? '').includes(term)
);
    }
  }

  // -----------------------------
  // User Modal
  // -----------------------------
  openAddUser() {
    this.userForm.reset({ role: 'user', active: true });
    this.editingUserId = null;
    this.showUserModal = true;
  }

  openEditUser(user: User) {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      active: user.active,
    });
    this.editingUserId = user.id;
    this.showUserModal = true;
  }

  saveUser() {
    if (this.userForm.invalid) return;
    const data = this.userForm.value;

    if (this.editingUserId) {
      this.adminService.updateUser(this.editingUserId, data);
    } else {
      this.adminService.addUser(data);
    }

    this.showUserModal = false;
  }

  removeUser(id: string) {
    if (!confirm('Delete this user?')) return;
    this.adminService.deleteUser(id);
  }

  // -----------------------------
  // Org Modal
  // -----------------------------
  openAddOrg() {
    this.orgForm.reset();
    this.editingOrgId = null;
    this.showOrgModal = true;
  }

  openEditOrg(org: Organization) {
    this.orgForm.patchValue({
      name: org.name,
      address: org.address,
      contact: org.contact,
    });
    this.editingOrgId = org.id;
    this.showOrgModal = true;
  }

  saveOrg() {
    if (this.orgForm.invalid) return;
    const data = this.orgForm.value;

    if (this.editingOrgId) {
      this.adminService.updateOrg(this.editingOrgId, data);
    } else {
      this.adminService.addOrg(data);
    }

    this.showOrgModal = false;
  }

  removeOrg(id: string) {
    if (!confirm('Delete this organization?')) return;
    this.adminService.deleteOrg(id);
  }

  // -----------------------------
  // Shared
  // -----------------------------
  closeModals() {
    this.showUserModal = false;
    this.showOrgModal = false;
  }
}
