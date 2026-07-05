package com.nexushr.nexushr.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.nexushr.nexushr.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(
            String to,
            String subject,
            String body) {

    	SimpleMailMessage mail = new SimpleMailMessage();

    	mail.setFrom("nexushr147@gmail.com");
    	mail.setTo(to);
    	mail.setSubject(subject);
    	mail.setText(body);

    	mailSender.send(mail);

    }

}