import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ProdutoService {
private apiUrl = 'http://localhost:5085/api/produtos';


constructor(private http: HttpClient) {}


listar(): Observable<any[]> {
return this.http.get<any[]>(this.apiUrl);
}


cadastrar(produto: any): Observable<any> {
return this.http.post(this.apiUrl, produto);
}


atualizar(codigo: number, produto: any): Observable<any> {
return this.http.put(`${this.apiUrl}/${codigo}`, produto);
}


excluir(codigo: number): Observable<any> {
return this.http.delete(`${this.apiUrl}/${codigo}`);
}

getItensDaNota(numero: number) {
  return this.http.get<any[]>(`${this.apiUrl}/notas/${numero}/itens`);
}


}