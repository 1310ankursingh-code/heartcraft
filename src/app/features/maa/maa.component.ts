import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-maa',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './maa.component.html',
  styleUrl: './maa.component.css'
})
export class MaaComponent implements OnInit {
  isGenerating = false;
  generatedLink = '';
  copied = false;
  isViewMode = false;
  
  step = 1;

  formData = {
    callHer: 'Maa',
    callsYou: '',
    gender: 'Her Son',
    language: 'English',
    letter: '',
  };

  constructor(private route: ActivatedRoute) {
    this.updateLetterTemplate();
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

  generateLink() {
    this.isGenerating = true;
    this.copied = false;

    const options = {
      key: 'rzp_test_SukelXe2qUALbN',
      amount: 1900, // 19 INR
      currency: 'INR',
      name: 'HeartWoven',
      description: 'Unlock your Gift for Maa Link',
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
        color: '#db91a3'
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
      this.generatedLink = `${window.location.origin}/maa?data=${encrypted}`;
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

  nextStep() {
    this.step++;
    if (this.step === 3 && this.formData.callsYou) {
      // Just visually appending it in the preview if it exists
      if (!this.formData.letter.includes(this.formData.callsYou)) {
        this.formData.letter += ' ' + this.formData.callsYou;
      }
    }
  }

  prevStep() {
    this.step--;
  }

  selectCallHer(val: string) { 
    this.formData.callHer = val; 
    this.updateLetterTemplate();
  }
  
  selectGender(val: string) { 
    this.formData.gender = val; 
    this.updateLetterTemplate();
  }
  
  selectLanguage(val: string) { 
    this.formData.language = val; 
    this.updateLetterTemplate();
  }

  updateLetterTemplate() {
    const isSon = this.formData.gender === 'Her Son';
    const c = this.formData.callHer;

    if (this.formData.language === 'English') {
      this.formData.letter = `Dear ${c},\n\nI've been meaning to say this for a long time, and I couldn't think of a better day than today.\n\nYou never asked for anything in return. You just loved - in the food you kept warm, in the silence you held when I needed space, in the small things you remembered about me that I had already forgotten about myself.\n\nSo much of who I am came quietly from you. I don't always say it, but I notice. Every single day.\n\nThank you for being exactly you.\n\n- With all my love,`;
    } 
    else if (this.formData.language === 'Hindi') {
      const chahta = isSon ? 'चाहता था' : 'चाहती थी';
      const chuka = isSon ? 'चुका होता हूँ' : 'चुकी होती हूँ';
      const kehta = isSon ? 'कहता नहीं' : 'कहती नहीं';
      const dekhta = isSon ? 'देखता हूँ' : 'देखती हूँ';
      const beta = isSon ? 'बेटे' : 'बेटी';

      this.formData.letter = `मेरी प्यारी ${c},\n\nमैं बहुत दिनों से आपसे यह कहना ${chahta}, और मुझे आज से बेहतर कोई दिन नहीं लगा।\n\nआपने कभी बदले में कुछ नहीं मांगा। आपने बस प्यार किया - उस गरम खाने में जो आपने मेरे लिए रखा, उस खामोशी में जब मुझे अकेले रहने की जरूरत थी, उन छोटी-छोटी बातों में जो आप मेरे बारे में याद रखती हैं जबकि मैं खुद उन्हें भूल ${chuka}।\n\nआज मैं जो कुछ भी हूँ, वो सब चुपचाप आपसे ही आया है। मैं हमेशा ${kehta}, लेकिन मैं सब ${dekhta}। हर एक दिन।\n\nहमेशा वैसे ही रहने के लिए शुक्रिया, जैसी आप हैं।\n\n- आपके ${beta} की तरफ से बहुत सारा प्यार,`;
    }
    else if (this.formData.language === 'Hinglish') {
      const chahta = isSon ? 'chahta tha' : 'chahti thi';
      const kehta = isSon ? 'kehta nahi' : 'kehti nahi';
      const samajh = isSon ? 'mujhe sab samajh aata hai' : 'mujhe sab samajh aati hai';

      this.formData.letter = `Dear ${c},\n\nMain bahut dino se aapko ye batana ${chahta}, aur mujhe aaj se accha din nahi mila.\n\nAapne kabhi badle me kuch nahi manga. Bas pyaar diya - us garam khane me jo aapne mere liye rakha, us shanti me jab mujhe akele rehna tha, meri un choti choti aadaton me jo aap hamesha yaad rakhti ho.\n\nMain aaj jo kuch bhi hoon, kahin na kahin aapki wajah se hi hoon. Shayad main roz ye ${kehta}, par ${samajh}. Har roz.\n\nThank you, hamesha aisi hi rehne ke liye.\n\n- Bohat saara pyaar,`;
    }
  }

  getParagraphs() {
    return this.formData.letter.split('\n').filter(p => p.trim() !== '');
  }
}
