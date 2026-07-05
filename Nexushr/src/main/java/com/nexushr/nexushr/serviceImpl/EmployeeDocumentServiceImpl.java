package com.nexushr.nexushr.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.EmployeeDocument;
import com.nexushr.nexushr.enums.DocumentType;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.EmployeeDocumentRepository;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.service.EmployeeDocumentService;

@Service
public class EmployeeDocumentServiceImpl implements EmployeeDocumentService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeDocumentRepository documentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public EmployeeDocument uploadDocument(
            Long employeeId,
            MultipartFile file,
            String documentType) throws IOException {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + employeeId));

        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String storedFileName =
                UUID.randomUUID().toString() + extension;

        Path targetPath = uploadPath.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING);

        EmployeeDocument document = new EmployeeDocument();

        document.setEmployee(employee);
        // Convert provided document type string to the DocumentType enum
        if (documentType != null) {
            try {
                String normalized = documentType.trim().toUpperCase().replace(" ", "_");
                DocumentType dt = DocumentType.valueOf(normalized);
                document.setDocumentType(dt);
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid document type: " + documentType);
            }
        } else {
            throw new IllegalArgumentException("Document type must be provided");
        }
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setFilePath(targetPath.toString());
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType());
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    @Override
    public List<EmployeeDocument> getDocumentsByEmployee(Long employeeId) {

        return documentRepository.findByEmployeeId(employeeId);

    }

    @Override
    public List<EmployeeDocument> getAllDocuments(int page, int size, String sortBy, String direction) {
        Sort sort = direction != null && direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return documentRepository.findAll(pageable).getContent();
    }

    @Override
    public EmployeeDocument getDocument(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id: " + id));

    }

    @Override
    public void deleteDocument(Long id) throws IOException {

        EmployeeDocument document = getDocument(id);

        Path file = Paths.get(document.getFilePath());

        if (Files.exists(file)) {
            Files.delete(file);
        }

        documentRepository.delete(document);
    }

}