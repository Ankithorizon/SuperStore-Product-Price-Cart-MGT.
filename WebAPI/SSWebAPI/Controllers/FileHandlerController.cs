using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SS.Entity.Context.Models;
using SS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;
using SS.Service.DTO;
using Microsoft.AspNetCore.Authorization;

namespace SSWebAPI.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    public class FileHandlerController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        public FileHandlerController(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }

        [Authorize("Admin")]
        [HttpPost]
        [RequestSizeLimit(40000000)]
        [Route("fileUpload")]
        public IActionResult FileUpload()
        {
            ProductFileAddResponse response = new ProductFileAddResponse();
            try
            {
                // check for 500
                // throw new Exception();

                var postedFile = Request.Form.Files[0];
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Files");
                
                // check for 400
                // if (!(postedFile.Length > 0))
                if (postedFile.Length > 0)
                {
                    var fileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute + "-" + ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition)
                        .FileName.Trim('"');
                    var finalPath = Path.Combine(uploadFolder, fileName);
                    using (var fileStream = new FileStream(finalPath, FileMode.Create))
                    {
                        postedFile.CopyTo(fileStream);
                    }
                    // return Ok($"File is uploaded Successfully");

                    // product file info save to db
                    ProductFile productFile = new ProductFile()
                    {
                        FilePath = finalPath,
                        FileName = fileName
                    };
                    response = _productRepo.ProductFileAdd(productFile);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("The File is not received.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {ex.Message}");
            }
        }

        [Authorize("Admin")]
        [HttpGet]
        [Route("getFiles")]
        public IActionResult GetFiles()
        {
            try
            {
                var currentDirectory = System.IO.Directory.GetCurrentDirectory();
                currentDirectory = currentDirectory + "\\Files";
                string[] filesWithPath = Directory.GetFiles(currentDirectory);
                List<string> files = new List<string>();

                if (filesWithPath != null)
                {
                    foreach (var file in filesWithPath)
                    {
                        files.Add(Path.GetFileName(file));
                    }
                }
                return Ok(files);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("download/{fileName}")]
        public async Task<IActionResult> Download(string fileName)
        {
            try
            {
                // fileName = "SSRS Training.pdf";
                var currentDirectory = System.IO.Directory.GetCurrentDirectory();
                currentDirectory = currentDirectory + "\\Files";
                var file = Path.Combine(currentDirectory, fileName);

                // check if file exists or not
                if (System.IO.File.Exists(file))
                {
                    var memory = new MemoryStream();
                    using (var stream = new FileStream(file, FileMode.Open))
                    {
                        await stream.CopyToAsync(memory);
                    }

                    memory.Position = 0;
                    return File(memory, GetMimeType(file), fileName);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        private string GetMimeType(string file)
        {
            string extension = Path.GetExtension(file).ToLowerInvariant();
            switch (extension)
            {
                case ".txt": return "text/plain";
                case ".pdf": return "application/pdf";
                case ".doc": return "application/vnd.ms-word";
                case ".docx": return "application/vnd.ms-word";
                case ".xls": return "application/vnd.ms-excel";
                case ".png": return "image/png";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".csv": return "text/csv";
                default: return "";
            }
        }
    }
}
