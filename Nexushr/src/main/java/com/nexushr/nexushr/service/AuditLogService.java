package com.nexushr.nexushr.service;

public interface AuditLogService {

    void saveAudit(

            String username,

            String action,

            String module,

            String description

    );

}