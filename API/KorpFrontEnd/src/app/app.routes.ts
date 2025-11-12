import { Routes } from '@angular/router';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { NotasComponent } from './components/notas/notas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'notas', component: NotasComponent }
];
