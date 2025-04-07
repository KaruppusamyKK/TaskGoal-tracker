//import jakarta.annotation.Resource;
//import org.springframework.core.io.ByteArrayResource;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.nio.file.Files;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipInputStream;
//
//@RestController
//public class FileController {
//
//    // Hardcoded ZIP Byte Array (Replace with your actual ZIP byte array)
//    private static final byte[] ZIP_BYTES = {
//            80, 75, 3, 4, ... // Add full byte array here
//};
//
//private static final String ZIP_FILE_PATH = "hardcoded.zip";
//private static final String OUTPUT_FOLDER = "extracted_files";
//
//@GetMapping("/readImage")
//public ResponseEntity<Resource> extractAndDisplayImage() throws IOException {
//    // Step 1: Save ZIP file from byte array
//    File zipFile = new File(ZIP_FILE_PATH);
//    try (FileOutputStream fos = new FileOutputStream(zipFile)) {
//        fos.write(FileController.ZIP_BYTES);
//    }
//
//    // Step 2: Extract the first image from the ZIP
//    File outputDir = new File(OUTPUT_FOLDER);
//    if (!outputDir.exists()) outputDir.mkdirs();
//
//    File extractedImage = null;
//    try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
//        ZipEntry entry;
//        while ((entry = zis.getNextEntry()) != null) {
//            if (entry.getName().endsWith(".jpg") || entry.getName().endsWith(".png")) { // Find an image
//                extractedImage = new File(outputDir, entry.getName());
//                try (FileOutputStream fos = new FileOutputStream(extractedImage)) {
//                    byte[] buffer = new byte[1024];
//                    int len;
//                    while ((len = zis.read(buffer)) > 0) {
//                        fos.write(buffer, 0, len);
//                    }
//                }
//                break; // Stop after extracting the first image
//            }
//        }
//    }
//
//    // Step 3: Return the extracted image
//    if (extractedImage != null && extractedImage.exists()) {
//        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(extractedImage.toPath()));
//
//        return ResponseEntity.ok()
//                .contentType(entry.getName().endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG)
//                .body(resource);
//    } else {
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//    }
//}
//}
