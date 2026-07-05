package com.nexushr.nexushr.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nexushr.nexushr.entity.EmployeeDocument;
import com.nexushr.nexushr.service.EmployeeDocumentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Employee Document Management",
        description = "Upload, Download and Manage Employee Documents"
)
@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private EmployeeDocumentService documentService;

    /*
     * Upload Document
     */
    @Operation(summary = "Upload Employee Document")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EmployeeDocument> uploadDocument(

            @RequestParam Long employeeId,

            @RequestParam String documentType,

            @RequestParam("file") MultipartFile file)

            throws IOException {

        EmployeeDocument document =
                documentService.uploadDocument(
                        employeeId,
                        file,
                        documentType);

        return ResponseEntity.ok(document);

    }

    /*
     * Get Documents
     */
    @Operation(summary = "Get Employee Documents")
    @GetMapping
    public ResponseEntity<List<EmployeeDocument>> getDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                documentService.getAllDocuments(page, size, sortBy, direction));

    }

    @Operation(summary = "Get Documents by Employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeDocument>> getEmployeeDocuments(

            @PathVariable Long employeeId) {

        return ResponseEntity.ok(

                documentService.getDocumentsByEmployee(employeeId));

    }

    /*
     * Download Document
     */
    @Operation(summary = "Download Employee Document")
    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadDocument(

            @PathVariable Long id)

            throws IOException {

        EmployeeDocument document =
                documentService.getDocument(id);

        Path path =
                Paths.get(document.getFilePath());

        byte[] data =
                Files.readAllBytes(path);

        ByteArrayResource resource =
                new ByteArrayResource(data);

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                document.getOriginalFileName() + "\"")

                .contentType(MediaType.parseMediaType(
                        document.getContentType()))

                .contentLength(document.getFileSize())

                .body(resource);

    }

    /*
     * Delete Document
     */
    @Operation(summary = "Delete Employee Document")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(

            @PathVariable Long id)

            throws IOException {

        documentService.deleteDocument(id);

        return ResponseEntity.ok("Document deleted successfully.");

    }

}