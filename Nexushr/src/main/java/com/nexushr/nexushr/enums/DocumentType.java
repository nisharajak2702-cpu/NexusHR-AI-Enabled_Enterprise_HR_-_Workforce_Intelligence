package com.nexushr.nexushr.enums;

import java.util.Arrays;
import java.util.List;

/**
 * Each document type knows which folder (under the base upload directory)
 * it belongs to, and which file extensions are allowed for it. This keeps
 * folder names and validation rules centralized instead of hardcoded
 * throughout the service layer.
 */
public enum DocumentType {

    PROFILE_PHOTO("photos", Arrays.asList("jpg", "jpeg", "png")),
    RESUME("resumes", Arrays.asList("pdf", "doc", "docx")),
    AADHAAR("aadhaar", Arrays.asList("pdf", "jpg", "jpeg", "png")),
    PAN("pan", Arrays.asList("pdf", "jpg", "jpeg", "png")),
    EDUCATIONAL_CERTIFICATE("certificates", Arrays.asList("pdf", "jpg", "jpeg", "png")),
    EXPERIENCE_CERTIFICATE("experience", Arrays.asList("pdf", "jpg", "jpeg", "png"));

    private final String folderName;
    private final List<String> allowedExtensions;

    DocumentType(String folderName, List<String> allowedExtensions) {
        this.folderName = folderName;
        this.allowedExtensions = allowedExtensions;
    }

    public String getFolderName() {
        return folderName;
    }

    public List<String> getAllowedExtensions() {
        return allowedExtensions;
    }

    public boolean isExtensionAllowed(String extension) {
        return extension != null && allowedExtensions.contains(extension.toLowerCase());
    }
}
