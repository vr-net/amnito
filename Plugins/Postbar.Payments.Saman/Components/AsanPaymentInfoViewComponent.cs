﻿using Microsoft.AspNetCore.Mvc;
using Nop.Web.Framework.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NopFarsi.Payments.SepShaparak.Components
{
    public class AsanPaymentInfoViewComponent : NopViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("~/Plugins/NopFarsi.Payments.SepShaparak/Views/PaymentInformation.cshtml");

        }
    }
}
