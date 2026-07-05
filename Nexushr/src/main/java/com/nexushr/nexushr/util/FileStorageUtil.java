package com.nexushr.nexushr.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Central place for all file-system logic used by the Document Management
 * module (creating folders, generating unique file names, saving and
 * deleting files on disk). Keeping this logic here means the service layer
 * never has to touch java.nio.file directly.
 */
@Component
public class FileStorageUtil {

    /**
     * Creates the given folder (and any missing parent folders) if it
     * doesn't already exist.
     */
    public void createFolderIfNotExists(String folderPath) {
        try {
            Path path = Paths.get(folderPath);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + folderPath, e);
        }
    }

    /**
     * Returns the extension of a file name (without the dot), lower-cased.
     * e.g. "photo.PNG" -> "png". Returns "" if there is no extension.
     */
    public String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    /**
     * Builds a unique, collision-free file name for storage while keeping
     * the original extension, e.g. "resume.pdf" -> "3f2a...-9c1b.pdf".
     */
    public String generateUniqueFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        String uniqueName = UUID.randomUUID().toString();
        return extension.isEmpty() ? uniqueName : uniqueName + "." + extension;
    }

    /**
     * Saves the given multipart file inside folderPath under a generated
     * unique name and returns the full path where it was stored.
     */
    public String saveFile(MultipartFile file, String folderPath) {
        createFolderIfNotExists(folderPath);

        String uniqueFileName = generateUniqueFileName(file.getOriginalFilename());
        Path targetPath = Paths.get(folderPath).resolve(uniqueFileName);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file: " + uniqueFileName, e);
        }

        return targetPath.toString();
    }

    /**
     * Deletes the file at the given path from disk, if it exists.
     */
    public void deleteFile(String filePath) {
        if (filePath == null) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            throw new IllegalStateException("Failed to delete file: " + filePath, e);
        }
    }
}
