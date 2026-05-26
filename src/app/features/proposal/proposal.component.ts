import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.css'
})
export class ProposalComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  isPreviewMode = false;
  saidYes = false;

  formData = {
    partnerName: '',
    senderName: '',
    question: '',
    message: ''
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
      this.generatedLink = `${window.location.origin}/proposal?data=${encrypted}`;
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

  sayYes() {
    this.saidYes = true;
  }

  dodgeNo(event: MouseEvent) {
    const btn = event.target as HTMLElement;
    btn.style.position = 'relative';
    const x = Math.random() * 150 - 75;
    const y = Math.random() * 100 - 50;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  }
}
