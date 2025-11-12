// src/app/services/nota-fiscal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemNotaDto {
  codigoProduto: number;
  descricaoProduto?: string;
  quantidade: number;
}

export interface NotaDto {
  numero: number;
  dataEmissao: string;
  status: string;
  itens: ItemNotaDto[];
}

@Injectable({ providedIn: 'root' })
export class NotaFiscalService {
  private apiUrl = 'http://localhost:5143/api/NotasFiscais'; // ajuste se necessário

  constructor(private http: HttpClient) {}

  listar(): Observable<NotaDto[]> {
    return this.http.get<NotaDto[]>(this.apiUrl);
  }

  criar(nota: NotaDto): Observable<NotaDto> {
    return this.http.post<NotaDto>(this.apiUrl, nota);
  }

  fechar(numero: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${numero}/fechar`, {});
  }
}
