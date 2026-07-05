package com.nexushr.nexushr.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.nexushr.nexushr.entity.EmployeeDocument;

public interface EmployeeDocumentService {

    EmployeeDocument uploadDocument(
            Long employeeId,
            MultipartFile file,
            String documentType) throws IOException;

    List<EmployeeDocument> getDocumentsByEmployee(Long employeeId);

    List<EmployeeDocument> getAllDocuments(int page, int size, String sortBy, String direction);

    EmployeeDocument getDocument(Long id);

    void deleteDocument(Long id) throws IOException;

}