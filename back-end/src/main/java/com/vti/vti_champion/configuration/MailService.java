package com.vti.vti_champion.configuration;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;

    public void sendCode(String toEmail, String code) {
        try {
            MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
            // Cấu hình helper hỗ trợ gửi HTML (tham số true thứ 2)
            MimeMessageHelper helper = new MimeMessageHelper(mimeMailMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Mã Xác Thực Tài Khoản - VTI Champion");

            // Giao diện HTML với CSS nội khối (inline)
            String htmlContent = """
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">VTI Champion</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                    <p style="font-size: 16px;">Chào bạn,</p>
                    <p>Bạn vừa yêu cầu mã xác thực để truy cập hệ thống. Vui lòng sử dụng mã dưới đây:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background: #f8f9fa; padding: 15px 30px; border-radius: 8px; border: 1px dashed #007bff;">
                            %s
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #666666;">
                        Mã này có hiệu lực trong <b>5 phút</b>. Vì lý do bảo mật, tuyệt đối không chia sẻ mã này với bất kỳ ai.
                    </p>
                </div>
                <div style="background-color: #f8f9fa; color: #999999; padding: 15px; text-align: center; font-size: 12px;">
                    &copy; 2026 VTI Champion Team. Đây là email tự động, vui lòng không phản hồi.
                </div>
            </div>
            """.formatted(code);

            helper.setText(htmlContent, true); // true để xác nhận nội dung là HTML

            javaMailSender.send(mimeMailMessage);
            System.out.println(">>> Đã gửi email thành công cho: " + toEmail);

        } catch (Exception e) {
            // Log chi tiết lỗi để dễ debug thay vì chỉ throw RuntimeException chung chung
            System.err.println(">>> LỖI GỬI EMAIL: " + e.getMessage());
            throw new RuntimeException("Gửi email thất bại: " + e.getLocalizedMessage());
        }
    }
}
