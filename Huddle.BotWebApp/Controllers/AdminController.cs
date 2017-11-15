using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Huddle.BotWebApp.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Consent()
        {
            return RedirectToAction("SignIn", "Account", new { prompt = "admin_consent", redirectUri = "/Admin/Consented" });
        }

        public ActionResult Consented(string code)
        {
            return View();
        }
    }
}