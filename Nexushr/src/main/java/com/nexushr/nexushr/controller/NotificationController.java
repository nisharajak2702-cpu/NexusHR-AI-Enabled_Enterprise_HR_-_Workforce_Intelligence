package com.nexushr.nexushr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.service.EmailService;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/test")
    public String test() {

        emailService.sendEmail(

                "nexushr147@gmail.com",

                "Nexus HR",

                "Email module working successfully."

        );

        return "Mail Sent Successfully";

    }

}