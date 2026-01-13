package com.water.webgis.controller;

import com.google.code.kaptcha.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Properties;

/**
 * 验证码控制器
 * 负责生成图形验证码并返回给前端
 */
@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {

    @Autowired
    private Producer captchaProducer; // 注入 Kaptcha 验证码生成器

    /**
     * 生成验证码图片
     * 
     * @param response HTTP 响应对象,用于输出图片流
     * @param session  HTTP Session,用于存储验证码文本
     * @throws IOException 图片写入异常
     */
    @GetMapping("/generate")
    public void getCaptcha(HttpServletResponse response, HttpSession session) throws IOException {
        // 设置响应内容类型为 JPEG 图片
        response.setContentType("image/jpeg");

        // 生成随机验证码文本
        String capText = captchaProducer.createText();

        // 将验证码文本存储到 Session 中,供登录时验证使用
        session.setAttribute("CAPTCHA_KEY", capText);

        // 调试日志:打印生成的验证码和 Session ID
        System.out.println("Captcha generated: " + capText + ", Session ID: " + session.getId());

        // 根据验证码文本生成图片
        BufferedImage bi = captchaProducer.createImage(capText);

        // 将图片写入响应输出流,返回给前端
        ImageIO.write(bi, "jpg", response.getOutputStream());
    }

    /**
     * Kaptcha 配置类
     * 配置验证码的样式和属性
     */
    @Configuration
    static class CaptchaConfig {

        /**
         * 创建验证码生成器 Bean
         * 
         * @return Kaptcha Producer 实例
         */
        @Bean
        public Producer captchaProducer() {
            Properties properties = new Properties();

            // 不显示边框
            properties.setProperty("kaptcha.border", "no");

            // 验证码字符集:只使用数字0-9
            properties.setProperty("kaptcha.textproducer.char.string", "0123456789");

            // 验证码长度:4位
            properties.setProperty("kaptcha.textproducer.char.length", "4");

            // 验证码文字颜色为黑色
            properties.setProperty("kaptcha.textproducer.font.color", "black");

            // 字符间距为 5 像素
            properties.setProperty("kaptcha.textproducer.char.space", "5");

            // 图片宽度 100 像素
            properties.setProperty("kaptcha.image.width", "100");

            // 图片高度 40 像素
            properties.setProperty("kaptcha.image.height", "40");

            // 字体大小 32
            properties.setProperty("kaptcha.textproducer.font.size", "32");

            // 创建 Kaptcha 配置对象
            com.google.code.kaptcha.util.Config config = new com.google.code.kaptcha.util.Config(properties);

            // 创建默认的 Kaptcha 实例
            com.google.code.kaptcha.impl.DefaultKaptcha defaultKaptcha = new com.google.code.kaptcha.impl.DefaultKaptcha();

            // 应用配置
            defaultKaptcha.setConfig(config);

            return defaultKaptcha;
        }
    }
}
