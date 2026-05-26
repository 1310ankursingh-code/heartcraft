import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProposalComponent } from './features/proposal/proposal.component';
import { PuzzleComponent } from './features/puzzle/puzzle.component';
import { BirthdayComponent } from './features/birthday/birthday.component';
import { SorryComponent } from './features/sorry/sorry.component';
import { QrComponent } from './features/qr/qr.component';
import { MaaComponent } from './features/maa/maa.component';
import { AnniversaryComponent } from './features/anniversary/anniversary.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'proposal', component: ProposalComponent },
  { path: 'proposal/:id', component: ProposalComponent },
  // { path: 'puzzle', component: PuzzleComponent },
  // { path: 'puzzle/:id', component: PuzzleComponent },
  { path: 'birthday', component: BirthdayComponent },
  { path: 'birthday/:id', component: BirthdayComponent },
  { path: 'sorry', component: SorryComponent },
  { path: 'sorry/:id', component: SorryComponent },
  { path: 'maa', component: MaaComponent },
  { path: 'anniversary', component: AnniversaryComponent },
  // { path: 'qr', component: QrComponent },
  // { path: 'qr/:id', component: QrComponent },
  { path: '**', redirectTo: '' }
];
