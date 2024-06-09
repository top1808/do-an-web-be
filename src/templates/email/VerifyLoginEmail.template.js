const VerifyLoginEmailTemplate = (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body {
            background-color: #f9f9f9;
            padding-right: 10px;
            padding-left: 10px;
        }
        .content {
            background-color: #ffffff;
            border-color: #e5e5e5;
            border-style: solid;
            border-width: 0 1px 1px 1px;
            max-width: 600px;
            width: 100%;
            height: 200px;
            margin-top: 20px;
            margin-bottom: 20px;
            border-top: solid 3px #8e2de2;
            border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
            border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
            text-align: center;
            padding: 20px 12px 0px;
        }
        h1 {
            padding-bottom: 5px;
            color: #000;
            font-family: Poppins, Helvetica, Arial, sans-serif;
            font-size: 28px;
            font-weight: 400;
            font-style: normal;
            letter-spacing: normal;
            line-height: 36px;
            text-transform: none;
            text-align: center;
        }
        h2 {
            margin-bottom: 30px;
            color: #999;
            font-family: Poppins, Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 300;
            font-style: normal;
            letter-spacing: normal;
            line-height: 24px;
            text-transform: none;
            text-align: center;
        }
        p {
            font-size: 14px;
            margin: 0px 21px;
            color: #666;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif;
            font-weight: 300;
            font-style: normal;
            letter-spacing: normal;
            line-height: 22px;
            margin-bottom: 40px;
        }
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
    <div class="d-flex align-items-center justify-content-center">
        <div class="content">
            <h1>Cảm ơn đã sử dụng dịch vụ của chúng tôi. Vui lòng bấm vào đây để xác nhận email của bạn.</h1>
            <a href="${data?.url}" class="btn-primary">Xác nhận email</a>
        </div>
    </div>
</table>
</body>
</html>
`
}

module.exports = VerifyLoginEmailTemplate;