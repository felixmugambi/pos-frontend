export const printReceipt = ({
    items,
    total,
    cash,
    change,
    method,
    cashier,
  }) => {
    const date = new Date().toLocaleString();
  
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: monospace;
              width: 250px;
              padding: 10px;
            }
            h2, p {
              text-align: center;
              margin: 5px 0;
            }
            hr {
              border: 1px dashed #000;
            }
            .row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
            }
            .total {
              font-weight: bold;
            }
          </style>
        </head>
  
        <body>
          <h2>WANANCHI MINIMART</h2>
          <p>${date}</p>
          <p>Cashier: ${cashier || "N/A"}</p>
  
          <hr/>
  
          ${items
            .map(
              (item) => `
            <div class="row">
              <span>${item.name} x${item.quantity}</span>
              <span>${item.quantity * item.selling_price}</span>
            </div>
          `
            )
            .join("")}
  
          <hr/>
  
          <div class="row total">
            <span>Total</span>
            <span>KES ${total}</span>
          </div>
  
          <div class="row">
            <span>Paid</span>
            <span>KES ${cash || total}</span>
          </div>
  
          <div class="row">
            <span>Change</span>
            <span>KES ${change}</span>
          </div>
  
          <hr/>
  
          <p>Payment: ${method.toUpperCase()}</p>
          <p>Thank you!</p>
        </body>
      </html>
    `;
  
    const printWindow = window.open("", "_blank", "width=300,height=600");
  
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  
    printWindow.focus();
  
    // ⏳ wait for content before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };