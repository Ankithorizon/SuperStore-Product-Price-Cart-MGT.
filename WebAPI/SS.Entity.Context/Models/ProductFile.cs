﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SS.Entity.Context.Models
{
    public class ProductFile
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductFileId { get; set; }

        [Required(ErrorMessage = "File Name is Required!")]
        public string FileName { get; set; }
        public string FilePath { get; set; }

    }
}
