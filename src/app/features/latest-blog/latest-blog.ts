import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from './services/blog.service';

@Component({
  selector: 'app-latest-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latest-blog.html',
  styleUrls: ['./latest-blog.css']
})
export class LatestBlog implements OnInit {
  blogs: Blog[] = [];
  paginatedBlogs: Blog[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;
    
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.totalPages = Math.ceil(blogs.length / this.itemsPerPage);
        this.updatePaginatedBlogs();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.error = 'Failed to load blogs. Please try again later.';
        this.loading = false;
      }
    });
  }

  updatePaginatedBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBlogs = this.blogs.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedBlogs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

