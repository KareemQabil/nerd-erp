import type {
  CartItem,
  Customer,
  Table,
  Discount,
  OrderType,
  Payment,
} from "../types/pos.types";

export interface ReceiptData {
  orderNumber: string;
  timestamp: Date;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  orderType: OrderType;
  customer?: Customer;
  table?: Table;
  appliedDiscount?: { discount: Discount; value: number };
  payment?: Payment;
}

export interface KitchenReceiptData {
  orderNumber: string;
  timestamp: Date;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  notes?: string;
}

export class PrintService {
  /**
   * Print customer receipt
   */
  static async printReceipt(data: ReceiptData): Promise<boolean> {
    try {
      const receiptHtml = this.generateReceiptHTML(data);
      return await this.print(receiptHtml, "receipt");
    } catch (error) {
      console.error("Failed to print receipt:", error);
      return false;
    }
  }

  /**
   * Print kitchen order
   */
  static async printKitchenReceipt(data: KitchenReceiptData): Promise<boolean> {
    try {
      const kitchenHtml = this.generateKitchenHTML(data);
      return await this.print(kitchenHtml, "kitchen");
    } catch (error) {
      console.error("Failed to print kitchen receipt:", error);
      return false;
    }
  }

  /**
   * Preview receipt (open in new window)
   */
  static previewReceipt(data: ReceiptData): void {
    const receiptHtml = this.generateReceiptHTML(data);
    const previewWindow = window.open("", "_blank", "width=400,height=600");
    if (previewWindow) {
      previewWindow.document.write(receiptHtml);
      previewWindow.document.close();
    }
  }

  /**
   * Generate customer receipt HTML
   */
  private static generateReceiptHTML(data: ReceiptData): string {
    const {
      orderNumber,
      timestamp,
      cashier,
      items,
      subtotal,
      tax,
      discount,
      total,
      orderType,
      customer,
      table,
      appliedDiscount,
      payment,
    } = data;

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    };

    const getOrderTypeLabel = (type: OrderType) => {
      switch (type) {
        case "dineIn":
          return "في المطعم";
        case "takeaway":
          return "تيك أواي";
        case "delivery":
          return "توصيل";
      }
    };

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة #${orderNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Almarai', Arial, sans-serif;
            width: 80mm;
            padding: 10px;
            background: white;
            color: #000;
          }
          
          .receipt {
            width: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px dashed #000;
          }
          
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .company-info {
            font-size: 11px;
            line-height: 1.4;
          }
          
          .order-info {
            margin: 15px 0;
            font-size: 12px;
          }
          
          .order-info-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          
          .items {
            margin: 15px 0;
          }
          
          .items-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            font-weight: bold;
            padding: 5px 0;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            font-size: 11px;
          }
          
          .item-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 5px 0;
            font-size: 11px;
            border-bottom: 1px dotted #ccc;
          }
          
          .item-modifiers {
            grid-column: 1 / -1;
            font-size: 10px;
            color: #666;
            padding: 2px 0 2px 10px;
          }
          
          .totals {
            margin: 15px 0;
            font-size: 12px;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          
          .totals-row.total {
            font-size: 16px;
            font-weight: bold;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          
          .payment-info {
            margin: 15px 0;
            font-size: 12px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 11px;
          }
          
          .barcode {
            text-align: center;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            letter-spacing: 2px;
          }
          
          @media print {
            body {
              width: 80mm;
            }
            
            @page {
              size: 80mm auto;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="header">
            <div class="logo">NerdPOS</div>
            <div class="company-info">
              مطعم الأطعمة الفاخرة<br>
              الرياض، المملكة العربية السعودية<br>
              هاتف: 920000000<br>
              سجل ضريبي: 300000000000003
            </div>
          </div>
          
          <!-- Order Info -->
          <div class="order-info">
            <div class="order-info-row">
              <span>رقم الفاتورة:</span>
              <strong>${orderNumber}</strong>
            </div>
            <div class="order-info-row">
              <span>التاريخ والوقت:</span>
              <span>${formatDate(timestamp)}</span>
            </div>
            <div class="order-info-row">
              <span>الكاشير:</span>
              <span>${cashier}</span>
            </div>
            <div class="order-info-row">
              <span>نوع الطلب:</span>
              <span>${getOrderTypeLabel(orderType)}</span>
            </div>
            ${
              table
                ? `
            <div class="order-info-row">
              <span>الطاولة:</span>
              <span>${table.name}</span>
            </div>
            `
                : ""
            }
            ${
              customer
                ? `
            <div class="order-info-row">
              <span>العميل:</span>
              <span>${customer.name}</span>
            </div>
            ${
              customer.phone
                ? `
            <div class="order-info-row">
              <span>الجوال:</span>
              <span>${customer.phone}</span>
            </div>
            `
                : ""
            }
            ${
              customer.loyaltyPoints !== undefined
                ? `
            <div class="order-info-row">
              <span>نقاط الولاء:</span>
              <span>${customer.loyaltyPoints} نقطة</span>
            </div>
            `
                : ""
            }
            `
                : ""
            }
          </div>
          
          <!-- Items -->
          <div class="items">
            <div class="items-header">
              <div>المنتج</div>
              <div>السعر</div>
              <div>الكمية</div>
              <div>الإجمالي</div>
            </div>
            ${items
              .map(
                (item) => `
              <div class="item-row">
                <div>${item.product.name}</div>
                <div>${item.price.toFixed(2)}</div>
                <div>${item.quantity}</div>
                <div>${item.total.toFixed(2)}</div>
              </div>
              ${
                item.modifiers && item.modifiers.length > 0
                  ? `
                <div class="item-modifiers">
                  ${item.modifiers
                    .map((mod) => `+ ${mod.name} (${mod.price.toFixed(2)} ر.س)`)
                    .join(", ")}
                </div>
              `
                  : ""
              }
              ${
                item.notes
                  ? `
                <div class="item-modifiers">
                  ملاحظة: ${item.notes}
                </div>
              `
                  : ""
              }
            `
              )
              .join("")}
          </div>
          
          <!-- Totals -->
          <div class="totals">
            <div class="totals-row">
              <span>المجموع الجزئي:</span>
              <span>${subtotal.toFixed(2)} ر.س</span>
            </div>
            ${
              discount > 0
                ? `
            <div class="totals-row">
              <span>الخصم ${
                appliedDiscount ? `(${appliedDiscount.discount.name})` : ""
              }:</span>
              <span>-${discount.toFixed(2)} ر.س</span>
            </div>
            `
                : ""
            }
            <div class="totals-row">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>${tax.toFixed(2)} ر.س</span>
            </div>
            <div class="totals-row total">
              <span>الإجمالي:</span>
              <span>${total.toFixed(2)} ر.س</span>
            </div>
          </div>
          
          <!-- Payment Info -->
          ${
            payment
              ? `
          <div class="payment-info">
            <div class="totals-row">
              <span>طريقة الدفع:</span>
              <span>${this.getPaymentMethodLabel(payment.method)}</span>
            </div>
            ${
              payment.method === "cash"
                ? `
            <div class="totals-row">
              <span>المبلغ المستلم:</span>
              <span>${payment.amount.toFixed(2)} ر.س</span>
            </div>
            <div class="totals-row">
              <span>الباقي:</span>
              <span>${(payment.amount - total).toFixed(2)} ر.س</span>
            </div>
            `
                : ""
            }
          </div>
          `
              : ""
          }
          
          <!-- Barcode -->
          <div class="barcode">
            *${orderNumber}*
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>شكراً لزيارتكم</p>
            <p>نسعد بخدمتكم دائماً</p>
            <p style="margin-top: 10px; font-size: 10px;">
              تم الطباعة: ${formatDate(new Date())}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate kitchen receipt HTML
   */
  private static generateKitchenHTML(data: KitchenReceiptData): string {
    const { orderNumber, timestamp, items, orderType, tableNumber, notes } =
      data;

    const formatTime = (date: Date) => {
      return new Intl.DateTimeFormat("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    };

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب مطبخ #${orderNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Almarai', Arial, sans-serif;
            width: 80mm;
            padding: 10px;
            background: white;
            color: #000;
          }
          
          .kitchen-receipt {
            width: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding: 15px;
            background: #000;
            color: #fff;
          }
          
          .order-number {
            font-size: 32px;
            font-weight: bold;
          }
          
          .order-time {
            font-size: 18px;
            margin-top: 5px;
          }
          
          .order-details {
            margin: 15px 0;
            font-size: 14px;
            font-weight: bold;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px;
            background: #f5f5f5;
          }
          
          .items {
            margin: 15px 0;
          }
          
          .item {
            margin: 10px 0;
            padding: 10px;
            border: 2px solid #000;
            border-radius: 5px;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .item-qty {
            font-size: 24px;
            font-weight: bold;
            padding: 5px 15px;
            background: #000;
            color: #fff;
            border-radius: 5px;
          }
          
          .item-modifiers {
            margin: 5px 0;
            padding: 5px 10px;
            background: #fff3cd;
            border-left: 3px solid #ffc107;
            font-size: 14px;
          }
          
          .item-notes {
            margin: 5px 0;
            padding: 5px 10px;
            background: #f8d7da;
            border-left: 3px solid #dc3545;
            font-size: 14px;
            font-weight: bold;
          }
          
          .order-notes {
            margin: 15px 0;
            padding: 15px;
            background: #dc3545;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            border-radius: 5px;
          }
          
          @media print {
            body {
              width: 80mm;
            }
            
            @page {
              size: 80mm auto;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="kitchen-receipt">
          <!-- Header -->
          <div class="header">
            <div class="order-number">#${orderNumber}</div>
            <div class="order-time">${formatTime(timestamp)}</div>
          </div>
          
          <!-- Order Details -->
          <div class="order-details">
            ${
              tableNumber
                ? `
            <div class="detail-row">
              <span>الطاولة:</span>
              <span style="font-size: 20px;">${tableNumber}</span>
            </div>
            `
                : ""
            }
            <div class="detail-row">
              <span>النوع:</span>
              <span>${
                orderType === "dineIn"
                  ? "في المطعم"
                  : orderType === "takeaway"
                  ? "تيك أواي"
                  : "توصيل"
              }</span>
            </div>
          </div>
          
          ${
            notes
              ? `
          <div class="order-notes">
            ⚠️ ${notes}
          </div>
          `
              : ""
          }
          
          <!-- Items -->
          <div class="items">
            ${items
              .map(
                (item) => `
              <div class="item">
                <div class="item-header">
                  <div>${item.product.name}</div>
                  <div class="item-qty">×${item.quantity}</div>
                </div>
                ${
                  item.modifiers && item.modifiers.length > 0
                    ? `
                  <div class="item-modifiers">
                    ${item.modifiers.map((mod) => `✓ ${mod.name}`).join("<br>")}
                  </div>
                `
                    : ""
                }
                ${
                  item.notes || item.specialInstructions
                    ? `
                  <div class="item-notes">
                    ⚠️ ${item.notes || item.specialInstructions}
                  </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send to printer
   */
  private static async print(
    html: string,
    type: "receipt" | "kitchen"
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // Create hidden iframe for printing
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        resolve(false);
        return;
      }

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Wait for content to load
      iframe.contentWindow?.addEventListener("load", () => {
        try {
          iframe.contentWindow?.print();

          // Clean up after print
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(true);
          }, 100);
        } catch (error) {
          console.error("Print failed:", error);
          document.body.removeChild(iframe);
          resolve(false);
        }
      });
    });
  }

  /**
   * Get payment method label
   */
  private static getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      cash: "نقدي",
      visa: "فيزا",
      mada: "مدى",
      stcpay: "STC Pay",
      tabby: "تابي",
      tamara: "تمارا",
      applepay: "Apple Pay",
      googlepay: "Google Pay",
      giftcard: "بطاقة هدية",
    };
    return labels[method] || method;
  }
}
