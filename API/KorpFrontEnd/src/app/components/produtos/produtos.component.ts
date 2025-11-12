import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtos: any[] = [];
  novo = { codigo: 0, descricao: '', saldo: 0 };
  editando: boolean = false;
  codigoEditando: number | null = null;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.produtoService.listar().subscribe((dados) => (this.produtos = dados));
  }

  cadastrar() {
    this.produtoService.cadastrar(this.novo).subscribe(() => {
      this.novo = { codigo: 0, descricao: '', saldo: 0 };
      this.listar();
    });
  }

  editar(produto: any) {
    this.editando = true;
    this.codigoEditando = produto.codigo;
    this.novo = { ...produto }; // carrega os dados no formulário
  }

  salvar() {
    if (this.editando && this.codigoEditando !== null) {
      this.produtoService
        .atualizar(this.codigoEditando, this.novo)
        .subscribe(() => {
          this.cancelarEdicao();
          this.listar();
        });
    } else {
      this.cadastrar();
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.codigoEditando = null;
    this.novo = { codigo: 0, descricao: '', saldo: 0 };
  }

  excluir(codigo: number) {
    this.produtoService.excluir(codigo).subscribe(() => this.listar());
  }
}
