using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // precisa desse using

namespace EstoqueService.Models
{
    public class Produto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // 👈 Adiciona essa linha
        public int Codigo { get; set; }

        public string Descricao { get; set; } = string.Empty;
        public int Saldo { get; set; }
    }
}
