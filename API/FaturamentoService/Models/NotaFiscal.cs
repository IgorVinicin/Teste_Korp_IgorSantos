using System.ComponentModel.DataAnnotations;

namespace FaturamentoService.Models
{
    public class NotaFiscal
    {
        [Key]
        public int Numero { get; set; }

        public DateTime DataEmissao { get; set; } = DateTime.Now;

        public string Status { get; set; } = "Aberta"; // Aberta ou Fechada

        public List<ItemNota> Itens { get; set; } = new();
    }
}
