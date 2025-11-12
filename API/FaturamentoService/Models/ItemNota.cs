using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FaturamentoService.Models
{
    public class ItemNota
    {
        [Key]
        public int Id { get; set; }

        public int CodigoProduto { get; set; }

        public string DescricaoProduto { get; set; } = string.Empty;

        public int Quantidade { get; set; }

        [ForeignKey("NotaFiscal")]
        public int NumeroNota { get; set; }
    }
}
