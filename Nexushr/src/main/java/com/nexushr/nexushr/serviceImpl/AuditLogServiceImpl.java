package com.nexushr.nexushr.serviceImpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.nexushr.nexushr.entity.AuditLog;
import com.nexushr.nexushr.repository.AuditLogRepository;
import com.nexushr.nexushr.service.AuditLogService;

@Service
public class AuditLogServiceImpl
implements AuditLogService{

    @Autowired
    private AuditLogRepository repository;

    @Override
    public void saveAudit(

            String username,

            String action,

            String module,

            String description){

        AuditLog log=new AuditLog();

        if(username==null){

            username=
                    SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();

        }

        log.setUsername(username);

        log.setAction(action);

        log.setModule(module);

        log.setDescription(description);

        log.setIpAddress("127.0.0.1");

        log.setCreatedAt(LocalDateTime.now());

        repository.save(log);

    }

}