import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-anniversary',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './anniversary.component.html',
  styleUrl: './anniversary.component.css'
})
export class AnniversaryComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  
  step = 1;
  isViewMode = false;
  isPreviewMode = false;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days = Array.from({length: 31}, (_, i) => i + 1);
  anniversaries = ['1st Anniversary', '2nd Anniversary', '3rd Anniversary', '4th Anniversary', '5th Anniversary', '10th Anniversary', 'Other'];

  formData = {
    partnerName: '',
    month: 'May',
    day: '9',
    type: '1st Anniversary',
    letter: '',
    promises: 'I will laugh at your jokes, even the bad ones. I promise to keep choosing you.',
    addPhoto: false
  };

  editingLetter = false;
  editingPromises = false;

  constructor(private route: ActivatedRoute) {
    this.updateLetter();
  }

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

  updateLetter() {
    if (!this.formData.letter || this.formData.letter.startsWith("Dear ")) {
      this.formData.letter = `Dear ${this.formData.partnerName || 'my love'},\n\nIt's our day again — ${this.formData.month} ${this.formData.day}.\n\nFrom the very first day, you have been my favorite chapter — the one I keep re-reading.\n\nThank you for the small things. The morning glances. The shared silences. The way you say my name like it means home.\n\nI promise to keep choosing you, in every season, every weather, every version of us we grow into.\n\nHere's to another year of tiny moments and big love.\n\nAlways yours,`;
    }
  }

  nextStep1() {
    this.updateLetter();
    this.step = 2;
  }

  nextStep2() {
    this.step = 3;
    this.isPreviewMode = true;
  }

  backStep() {
    this.step--;
    if(this.step === 2) this.isPreviewMode = false;
  }

  generateLink() {
    this.isGenerating = true;
    this.copied = false;

    const options = {
      key: 'rzp_test_SukelXe2qUALbN',
      amount: 1900, // 19 INR
      currency: 'INR',
      name: 'HeartWoven',
      description: 'Unlock your Anniversary Surprise Link',
      image: 'assets/logo.png',
      handler: (response: any) => {
        if (response.razorpay_payment_id) {
          this.finalizeLink();
        } else {
          this.isGenerating = false;
        }
      },
      modal: {
        ondismiss: () => {
          this.isGenerating = false;
        }
      },
      theme: {
        color: '#734656'
      }
    };
    
    try {
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (e) {
      this.isGenerating = false;
      alert("Payment gateway unavailable.");
    }
  }

  finalizeLink() {
    setTimeout(() => {
      const dataStr = JSON.stringify(this.formData);
      const encrypted = btoa(encodeURIComponent(dataStr));
      this.generatedLink = `${window.location.origin}/anniversary?data=${encrypted}`;
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
}
