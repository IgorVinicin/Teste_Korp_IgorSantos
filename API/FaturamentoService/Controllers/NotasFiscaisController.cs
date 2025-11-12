using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using FaturamentoService.Models;
using System.Net.Http.Json;

namespace FaturamentoService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotasFiscaisController : ControllerBase
    {
        private readonly FaturamentoContext _context;
        private readonly HttpClient _httpClient;

        public NotasFiscaisController(FaturamentoContext context)
        {
            _context = context;

            // HttpClient configurado para ambiente local (HTTP)
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            _httpClient = new HttpClient(handler);
        }

        // GET: api/NotasFiscais
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotas()
        {
            return await _context.NotasFiscais
                .Include(n => n.Itens)
                .ToListAsync();
        }

        // POST: api/NotasFiscais
        [HttpPost]
        public async Task<ActionResult<NotaFiscal>> CriarNota(NotaFiscal nota)
        {
            bool existe = await _context.NotasFiscais.AnyAsync(n => n.Numero == nota.Numero);
            if (existe)
                return Conflict(new { message = $"A nota {nota.Numero} já existe." });

            _context.NotasFiscais.Add(nota);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotas), new { numero = nota.Numero }, nota);
        }

        // POST: api/NotasFiscais/{numero}/fechar
        [HttpPost("{numero}/fechar")]
        public async Task<IActionResult> FecharNota(int numero)
        {
            var nota = await _context.NotasFiscais
                .Include(n => n.Itens)
                .FirstOrDefaultAsync(n => n.Numero == numero);

            if (nota == null)
                return NotFound("Nota não encontrada.");

            if (nota.Status == "Fechada")
                return BadRequest("A nota já foi fechada.");

            foreach (var item in nota.Itens)
            {
                try
                {
                    // 🔹 URL do EstoqueService — CONFIRME a porta no terminal
                    var produto = await _httpClient.GetFromJsonAsync<Produto>(
                        $"http://localhost:5085/api/produtos/{item.CodigoProduto}");

                    if (produto == null)
                        return NotFound($"Produto {item.CodigoProduto} não encontrado no estoque.");

                    if (produto.Saldo < item.Quantidade)
                        return BadRequest($"Estoque insuficiente para o produto {produto.Descricao}.");

                    int novoSaldo = produto.Saldo - item.Quantidade;

                    var produtoAtualizado = new
                    {
                        Codigo = item.CodigoProduto,
                        Descricao = produto.Descricao,
                        Saldo = novoSaldo
                    };

                    var response = await _httpClient.PutAsJsonAsync(
                        $"http://localhost:5085/api/produtos/{item.CodigoProduto}",
                        produtoAtualizado);

                    if (!response.IsSuccessStatusCode)
                    {
                        return StatusCode((int)response.StatusCode,
                            $"Erro ao atualizar o produto {item.CodigoProduto} no estoque.");
                    }
                }
                catch (HttpRequestException ex)
                {
                    return StatusCode(500,
                        $"Erro ao conectar com o serviço de estoque: {ex.Message}");
                }
            }

            nota.Status = "Fechada";
            await _context.SaveChangesAsync();

            return Ok($"Nota {numero} fechada com sucesso!");
        }
    }
}
