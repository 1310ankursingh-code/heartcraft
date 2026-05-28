import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-birthday',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './birthday.component.html',
  styleUrl: './birthday.component.css'
})
export class BirthdayComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  isPreviewMode = false;
  candlesBlown = false;

  formData = {
    bdayName: '',
    senderName: '',
    cakeFlav: 'Chocolate Truffle',
    wishes: ''
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

    const options = {
      key: 'rzp_test_SukelXe2qUALbN',
      amount: 1900, // 19 INR
      currency: 'INR',
      name: 'HeartWoven',
      description: 'Unlock your Birthday Bash Link',
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
      prefill: {
        name: this.formData.senderName || 'User',
      },
      theme: {
        color: '#fb923c'
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
      this.generatedLink = `${window.location.origin}/birthday?data=${encrypted}`;
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

  blowCandles() {
    this.candlesBlown = true;
  }
}
