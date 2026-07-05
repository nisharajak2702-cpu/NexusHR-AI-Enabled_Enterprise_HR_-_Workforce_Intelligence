package com.nexushr.nexushr.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nexushr.nexushr.enums.DocumentType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="employee_documents")

public class EmployeeDocument {
	
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne
@JoinColumn(name = "employee_id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "documents"})
private Employee employee;

@Enumerated(EnumType.STRING)
private DocumentType documentType;

private String originalFileName;

private String storedFileName;

private String filePath;

private String contentType;

private Long fileSize;

private LocalDateTime uploadedAt;

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public Employee getEmployee() {
	return employee;
}

public void setEmployee(Employee employee) {
	this.employee = employee;
}

public DocumentType getDocumentType() {
	return documentType;
}

public void setDocumentType(DocumentType documentType) {
	this.documentType = documentType;
}

public String getFileName() {
	return originalFileName;
}

public void setFileName(String fileName) {
	this.originalFileName = fileName;
}

public String getFilePath() {
	return filePath;
}

public void setFilePath(String filePath) {
	this.filePath = filePath;
}

public LocalDateTime getUploadedAt() {
	return uploadedAt;
}

public void setUploadedAt(LocalDateTime uploadedAt) {
	this.uploadedAt = uploadedAt;
}

public String getOriginalFileName() {
	return originalFileName;
}

public void setOriginalFileName(String originalFileName) {
	this.originalFileName = originalFileName;
}

public String getStoredFileName() {
	return storedFileName;
}

public void setStoredFileName(String storedFileName) {
	this.storedFileName = storedFileName;
}

public String getContentType() {
	return contentType;
}

public void setContentType(String contentType) {
	this.contentType = contentType;
}

public Long getFileSize() {
	return fileSize;
}

public void setFileSize(Long fileSize) {
	this.fileSize = fileSize;
}

}