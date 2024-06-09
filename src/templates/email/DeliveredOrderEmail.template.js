const { formatDateTimeStringRender, customMoney } = require("../../utils/functionHelper");

const DeliveredOrderTemplate = (data) => {
    return `<html>
    <head>
    <style>
     a.btn-primary {
            background: #8e2de2;
            background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
            background: linear-gradient(to right, #8e2de2, #4a00e0);
            border: none;
            font-family: Poppins, Helvetica, Arial, sans-serif;
            font-weight: 200;
            font-style: normal;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 10px 20px;
            color: #fff;
            border-radius: 3px;
            font-size: 14px;
        }
    </style>
    </head>
<body>
  <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%;background:#e9e9e9;padding:50px 0px">
    <tr>
      <td>
        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px;background:#ffffff;padding:0px 25px">
          <tbody>
            <tr>
              <td style="margin:0;padding:0">
                <table border="0" cellpadding="" cellspacing="0" width="100%" style="background:#ffffff;color:#000000;line-height:150%;text-align:center;font:300 16px &#39;Helvetica Neue&#39;,Helvetica,Arial,sans-serif">
                  <tbody>
                    <tr>
                      <td valign="top" width="100">
                        <h3 style="text-align:center;text-transform:uppercase">T&T Shop</h3>
                        <p><span style="font-size:18px;font-weight:bold">Chúng tôi đã giao hàng cho bạn. Vui lòng xác nhận đơn hàng.</span></p>
                        <p><a href="${process.env.DOMAIN_FE_SALE + "/profile/purchased"}" class="btn-primary">Xác nhận đơn hàng</a></p>
                        <p>Phương thức thanh toán: <span style="font-size:18px;font-weight:bold">${data?.paymentMethod || "Thanh toán khi nhận hàng"} </span></p>
                        <p>Ngày đặt hàng: <span style="font-size:18px;font-weight:bold">${formatDateTimeStringRender(data?.createdAt)}</span></p>
                        <p>Ngày giao hàng: <span style="font-size:18px;font-weight:bold">${formatDateTimeStringRender(data?.deliveryDate)}</span></p>
                        <p>Ngày nhận hàng: <span style="font-size:18px;font-weight:bold">${formatDateTimeStringRender()}</span></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <table border="0" cellpadding="20" cellspacing="0" width="100%" style="color:#000000;line-height:150%;text-align:left;font:300 16px &#39;Helvetica Neue&#39;,Helvetica,Arial,sans-serif">
                  <tbody>
                    <tr>
                      <td valign="top" style="font-size:24px;">
                        <span style="text-decoration:underline;">Mã đơn hàng: #${data?.orderCode}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" cellspacing="0" cellpadding="6" width="95%" style="border:0;color:#000000;line-height:150%;text-align:left;font:300 14px/30px &#39;Helvetica Neue&#39;,Helvetica,Arial,sans-serif;" border=".5px">
                  <thead>
                    <tr style="background:#efefef">
                      <th scope="col" width="30%" style="text-align:left;border:1px solid #eee">Tên sản phẩm</th>
                      <th scope="col" width="30%" style="text-align:left;border:1px solid #eee">Thuộc tính</th>
                      <th scope="col" width="15%" style="text-align:right;border:1px solid #eee">Số lượng</th>
                      <th scope="col" width="20%" style="text-align:right;border:1px solid #eee">Giá sản phẩm</th>
                      <th scope="col" width="20%" style="text-align:right;border:1px solid #eee">Tổng giá sản phẩm</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data?.products?.map(item => (
                        `<tr width="100%">
                          <td width="30%" style="text-align:left;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0;word-wrap:break-word">
                            ${item?.productName}
                          </td>
                          <td width="15%" style="text-align:left;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0;word-wrap:break-word">
                            ${item?.options?.map(option => `${option.groupName}: ${option.option}, `).join("").slice(0, -2)}
                          </td>
                          <td width="15%" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0">
                            ${item?.quantity}
                          </td>
                          <td width="20%" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0"><span>${customMoney(item?.price)}</span></td>
                          <td width="20%" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0"><span>${customMoney(item?.price * item?.quantity)}</span></td>
                        </tr>`
                    )).join('')}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th scope="row" colspan="4" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0">Tổng giá sản phẩm </th>
                      <th style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0"><span>${customMoney(data?.totalProductPrice)}</span></th>
                    </tr>
                    <tr>
                      <th scope="row" colspan="4" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0">
                        Giá vận chuyển</th>
                      <td style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0"><span>${customMoney(data?.deliveryFee)}</span></td>
                    </tr>
                    ${data?.voucherCode ? (`
                    <tr>
                      <th scope="row" colspan="4" style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0">
                        Voucher</th>
                      <td style="text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0"><span>-${customMoney(data?.voucherDiscount)}</span></td>
                    </tr>
                        `) : (``)}
                    <tr>
                      <th scope="row" colspan="4" style="text-align:right;background:#efefef;text-align:right;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:0;border-top:0">Tổng đơn hàng</th>
                      <td style="background:#efefef;text-align:right;vertical-align:middle;border-left:1px solid #eee;border-bottom:1px solid #eee;border-right:1px solid #eee;border-top:0;color:#7db701;font-weight:bold"><span>${customMoney(data?.totalPrice)}</span></td>
                    </tr>
                  </tfoot>
                </table>
                <br>
                <br>
                <table border="0" cellpadding="20" cellspacing="0" width="100%" style="color:#000000;line-height:150%;text-align:left;font:300 14px &#39;Helvetica Neue&#39;,Helvetica,Arial,sans-serif">
                  <tbody>
                    <tr>
                      <td valign="top">
                        <h4 style="font-size:24px;margin:0;padding:0;margin-bottom:10px;">Thông tin khách hàng</h4>
                        <p style="margin:0;margin-bottom:10px;padding:0;"><strong>Email:</strong> <a href="${data?.customerEmail}" target="_blank">${data?.customerEmail}</a></p>
                        <p style="margin:0;margin-bottom:10px;padding:0;"><strong>SĐT:</strong> ${data?.customerPhone}</p>
                        <p style="margin:0;margin-bottom:10px;padding:0;"><strong>Địa chỉ giao hàng:</strong> ${data?.deliveryAddress}, ${data?.customerWard?.label}, ${data?.customerDistrict?.label}, ${data?.customerProvince?.label}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <br>

                <table cellspacing="0" cellpadding="6" width="100%" style="color:#000000;line-height:150%;text-align:left;font:300 16px &#39;Helvetica Neue&#39;,Helvetica,Arial,sans-serif" border="0">
                  <tbody>
                    <tr>
                      <td valign="top" style="text-transform:capitalize">
                        <p style="font-size:12px;line-height:130%">Cảm ơn quý khách đã tin tưởng và đặt hàng bên chúng tôi. Nếu bạn có thắc mắc vui lòng liên hệ cho chúng tôi sớm nhất để chúng tôi hỗ trợ cho bạn.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

module.exports = DeliveredOrderTemplate;