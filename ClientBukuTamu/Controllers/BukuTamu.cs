using Microsoft.AspNetCore.Mvc;

namespace ClientBukuTamu.Controllers
{
    public class BukuTamu : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
