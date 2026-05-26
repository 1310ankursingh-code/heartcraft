import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.css'
})
export class PuzzleComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  puzzleSolved = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.isViewMode = true;
      }
    });
  }

  generateLink() {
    this.isGenerating = true;
    this.copied = false;
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(2, 10);
      this.generatedLink = `${window.location.origin}/puzzle/${uniqueId}`;
      this.isGenerating = false;
    }, 1200);
  }

  copyLink() {
    navigator.clipboard.writeText(this.generatedLink).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }

  solvePuzzle() {
    this.puzzleSolved = true;
  }
}
