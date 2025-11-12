using Microsoft.EntityFrameworkCore;
using FaturamentoService.Models;

namespace FaturamentoService.Data
{
    public class FaturamentoContext : DbContext
    {
        public FaturamentoContext(DbContextOptions<FaturamentoContext> options)
            : base(options)
        {
        }

        public DbSet<NotaFiscal> NotasFiscais { get; set; }
        public DbSet<ItemNota> ItensNotas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NotaFiscal>()
                .HasKey(n => n.Numero);

            modelBuilder.Entity<ItemNota>()
                .HasKey(i => i.Id);

            modelBuilder.Entity<NotaFiscal>()
                .HasMany(n => n.Itens)
                .WithOne()
                .HasForeignKey(i => i.NumeroNota)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
