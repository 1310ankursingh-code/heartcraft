import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sorry',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sorry.component.html',
  styleUrl: './sorry.component.css'
})
export class SorryComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  isPreviewMode = false;
  forgiven = false;

  formData = {
    apologyTo: '',
    senderName: '',
    reason: '',
    forgiveness: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          const decoded = decodeURIComponent(atob(params['data']));
          this.formData = JSON.parse(decoded);
          this.isViewMode = true;
        } catch (e) {
          console.error("Invalid data payload");
        }
      }
    });
  }

  generateLink() {
    this.isGenerating = true;
    this.copied = false;
    setTimeout(() => {
      const dataStr = JSON.stringify(this.formData);
      const encrypted = btoa(encodeURIComponent(dataStr));
      this.generatedLink = `${window.location.origin}/sorry?data=${encrypted}`;
      this.isGenerating = false;
    }, 800);
  }

  copyLink() {
    navigator.clipboard.writeText(this.generatedLink).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }

  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode;
    this.isViewMode = this.isPreviewMode;
  }

  forgive() {
    this.forgiven = true;
  }
}
