using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nop.Plugin.Misc.ShippingSolutions.Models.Results.Taroff
{
    /// <summary>
    /// مدل خروجی متد ثبت گروهی بارنامه مخصوص مشتری
    ///<para>CodeStatus کد خطای برگشتی</para>
    ///<para>Message متن برگشتی</para>
    /// <para>objects آبجکت خروجی</para>
    /// </summary>
    public class Result_Taroff_GetListCarriers
    {
        public bool Status { get; set; }
        public int CodeStatus { get; set; }
        public string Message { get; set; }
        public List<Category> categories { get; set; }

    }
    public class DetailResult_GetListCarriers
    {
        public string state { get; set; }
        public List<Category> categories { get; set; }
    }
}
