import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaFiscalService, NotaDto, ItemNotaDto } from '../../services/nota-fiscal.service';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {
  notas: NotaDto[] = [];
  produtos: any[] = []; // do ProdutoService
  itens: { produtoId?: number; descricao?: string; quantidade: number; saldo?: number }[] = [];
  numeroEmCriacao: number | null = null;
  loading = false;
  errorMessage = '';

  notaSelecionada: NotaDto | null = null;
  itensDaNota: ItemNotaDto[] = [];

  constructor(
    private notaSvc: NotaFiscalService,
    private prodSvc: ProdutoService
  ) {}

  ngOnInit() {
    this.reloadEverything();
  }

  async reloadEverything() {
    this.errorMessage = '';
    this.loading = true;
    try {
      const [produtos, notas] = await Promise.all([
        this.prodSvc.listar().toPromise(),
        this.notaSvc.listar().toPromise()
      ]);
      this.produtos = produtos || [];
      this.notas = notas || [];
      this.numeroEmCriacao = this.calcularProximoNumero();
      this.itens = [{ quantidade: 1 }];
    } catch (err: any) {
      console.error(err);
      this.errorMessage = 'Erro ao carregar dados. Verifique se as APIs estão rodando.';
    } finally {
      this.loading = false;
    }
  }

  calcularProximoNumero(): number {
    if (!this.notas || this.notas.length === 0) return 1;
    const max = this.notas.reduce((m, n) => Math.max(m, n.numero), 0);
    return max + 1;
  }

  adicionarItem() {
    this.itens.push({ quantidade: 1 });
  }

  removerItem(index: number) {
    this.itens.splice(index, 1);
  }

  onProdutoChange(index: number) {
    const sel = this.itens[index];
    if (!sel.produtoId) return;
    const p = this.produtos.find(x => x.codigo === Number(sel.produtoId));
    if (p) {
      sel.descricao = p.descricao;
      sel.saldo = p.saldo;
      if (!sel.quantidade) sel.quantidade = 1;
    }
  }

  validarItens(): string | null {
    if (!this.numeroEmCriacao) return 'Número da nota inválido.';
    if (!this.itens.length) return 'Adicione ao menos um item.';
    for (let i = 0; i < this.itens.length; i++) {
      const it = this.itens[i];
      if (!it.produtoId) return `Item ${i + 1}: selecione um produto.`;
      if (!it.quantidade || it.quantidade <= 0) return `Item ${i + 1}: quantidade inválida.`;
      if (it.saldo !== undefined && it.quantidade > it.saldo) {
        return `Item ${i + 1}: quantidade (${it.quantidade}) maior que saldo (${it.saldo}).`;
      }
    }
    return null;
  }

  criarNota() {
    this.errorMessage = '';
    const valida = this.validarItens();
    if (valida) { this.errorMessage = valida; return; }

    const nota: NotaDto = {
      numero: this.numeroEmCriacao!,
      dataEmissao: new Date().toISOString(),
      status: 'Aberta',
      itens: this.itens.map(it => ({
        codigoProduto: Number(it.produtoId),
        descricaoProduto: it.descricao || '',
        quantidade: Number(it.quantidade)
      }))
    };

    this.loading = true;
    this.notaSvc.criar(nota).subscribe({
      next: _ => {
        this.reloadEverything();
        alert(`Nota ${nota.numero} criada com sucesso.`);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Erro ao criar nota.';
        this.loading = false;
      }
    });
  }

  fecharNota(numero: number) {
    if (!confirm(`Fechar (imprimir) a nota ${numero}?`)) return;
    this.loading = true;
    this.notaSvc.fechar(numero).subscribe({
      next: _ => {
        alert(`Nota ${numero} fechada com sucesso.`);
        this.reloadEverything();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error || err?.message || 'Erro ao fechar nota.';
        this.loading = false;
      }
    });
  }

  verItens(nota: NotaDto) {
    this.notaSelecionada = nota;
    this.itensDaNota = nota.itens || [];
  }

  fecharModal() {
    this.notaSelecionada = null;
    this.itensDaNota = [];
  }
}
