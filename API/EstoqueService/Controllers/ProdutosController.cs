using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EstoqueService.Data;
using EstoqueService.Models;

namespace EstoqueService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly EstoqueContext _context;

        public ProdutosController(EstoqueContext context)
        {
            _context = context;
        }

        // GET: api/produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos.ToListAsync();
        }

        // GET: api/produtos/5
        [HttpGet("{codigo}")]
        public async Task<ActionResult<Produto>> GetProduto(int codigo)
        {
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Codigo == codigo);

            if (produto == null)
                return NotFound();

            return produto;
        }

        // POST: api/produtos
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            // Verifica se já existe um produto com o mesmo código
            var existente = await _context.Produtos
                .AnyAsync(p => p.Codigo == produto.Codigo);

            if (existente)
                return Conflict(new { message = "Já existe um produto com esse código." });

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduto), new { codigo = produto.Codigo }, produto);
        }

        // PUT: api/produtos/5
        [HttpPut("{codigo}")]
        public async Task<IActionResult> PutProduto(int codigo, Produto produto)
        {
            if (codigo != produto.Codigo)
                return BadRequest();

            var existente = await _context.Produtos
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Codigo == codigo);

            if (existente == null)
                return NotFound();

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Erro ao atualizar o produto.");
            }

            return NoContent();
        }

        // DELETE: api/produtos/5
        [HttpDelete("{codigo}")]
        public async Task<IActionResult> DeleteProduto(int codigo)
        {
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Codigo == codigo);

            if (produto == null)
                return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
