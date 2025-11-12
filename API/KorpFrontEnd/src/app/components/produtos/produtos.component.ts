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

  // 🔔 Mensagens de feedback
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.produtoService.listar().subscribe({
      next: (dados) => (this.produtos = dados),
      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
        this.errorMessage = 'Erro ao carregar produtos. Verifique se a API está rodando.';
        this.limparMensagens();
      },
    });
  }

  cadastrar() {
    this.produtoService.cadastrar(this.novo).subscribe({
      next: () => {
        this.successMessage = 'Produto cadastrado com sucesso!';
        this.novo = { codigo: 0, descricao: '', saldo: 0 };
        this.listar();
        this.limparMensagens();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);
        this.errorMessage = 'Erro ao cadastrar produto. Verifique os dados e tente novamente.';
        this.limparMensagens();
      },
    });
  }

  editar(produto: any) {
    this.editando = true;
    this.codigoEditando = produto.codigo;
    this.novo = { ...produto };
  }

  salvar() {
    if (this.editando && this.codigoEditando !== null) {
      this.produtoService.atualizar(this.codigoEditando, this.novo).subscribe({
        next: () => {
          this.successMessage = 'Produto atualizado com sucesso!';
          this.cancelarEdicao();
          this.listar();
          this.limparMensagens();
        },
        error: (erro) => {
          console.error('Erro ao atualizar produto:', erro);
          this.errorMessage = 'Erro ao atualizar produto. Tente novamente.';
          this.limparMensagens();
        },
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
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    this.produtoService.excluir(codigo).subscribe({
      next: () => {
        this.successMessage = 'Produto excluído com sucesso!';
        this.listar();
        this.limparMensagens();
      },
      error: (erro) => {
        console.error('Erro ao excluir produto:', erro);
        this.errorMessage = 'Erro ao excluir produto. Verifique se ele ainda existe.';
        this.limparMensagens();
      },
    });
  }

  // ⏳ Limpa mensagens automaticamente após alguns segundos
  limparMensagens() {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 4000);
  }
}
