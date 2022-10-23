﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nop.Plugin.Orders.MultiShipping.Models
{
    public class OrderItemAttributeValue
    {
        public int Id { get; set; }
        public int OrderItemId { get; set; }
        public int PropertyAttrId { get; set; }
        public int? PropertyAttrValueId { get; set; }
        public string PropertyAttrValueText { get; set; }
        public int? PropertyAttrValuePrice { get; set; }
        public int? PropertyAttrValueCost { get; set; }
        public string PropertyAttrValueName { get; set; }
        public string PropertyAttrName { get; set; }
    }
}
