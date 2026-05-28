import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  paid = false;

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

    const options = {
      key: 'rzp_test_SukelXe2qUALbN',
      amount: 1900,
      currency: 'INR',
      name: 'HeartWoven',
      description: 'Unlock your Photo QR Link',
      image: 'assets/logo.png',
      handler: (response: any) => {
        if (response.razorpay_payment_id) {
          this.finalizeLink();
        } else {
          this.isGenerating = false;
        }
      },
      modal: { ondismiss: () => this.isGenerating = false },
      theme: { color: '#ec4899' }
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
      const uniqueId = Math.random().toString(36).substring(2, 10);
      this.generatedLink = `${window.location.origin}/qr/${uniqueId}`;
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

  simulatePayment() {
    this.paid = true;
  }
}
